from facenet_pytorch import MTCNN
import cv2
import logging
import base64

logger = logging.Logger("FastMTCNN")


class FastMTCNN(object):
    """Fast MTCNN implementation."""

    def __init__(self, stride, resize=1, *args, **kwargs):
        """Constructor for FastMTCNN class.

        Arguments:
            stride (int): The detection stride. Faces will be detected every `stride` frames
                and remembered for `stride-1` frames.

        Keyword arguments:
            resize (float): Fractional frame scaling. [default: {1}]
            *args: Arguments to pass to the MTCNN constructor. See help(MTCNN).
            **kwargs: Keyword arguments to pass to the MTCNN constructor. See help(MTCNN).
        """
        self.stride = stride
        self.resize = resize
        self.mtcnn = MTCNN(*args, **kwargs) 

    def __call__(self, frames):
        """Detect faces in frames using strided MTCNN."""
        if self.resize != 1:
            frames = [
                cv2.resize(
                    f, (int(f.shape[1] * self.resize), int(f.shape[0] * self.resize))
                )
                for f in frames
            ]

        cur_frame = frames[:: self.stride]
        boxes, probs = self.mtcnn.detect(cur_frame)

        faces = []
        for i, frame in enumerate(frames):
            box_ind = int(i / self.stride)
            if boxes[box_ind] is None:
                continue

            cur_obj = dict()
            for i, (box, prob) in enumerate(zip(boxes[box_ind], probs[box_ind])):
                cur_obj["box"] = box
                cur_obj["confidence"] = prob
                box = [max(0, int(b)) for b in box]
                cur_obj["image"] = frame[box[1] : box[3], box[0] : box[2]]
                faces.append(cur_obj)
        return faces


def cv_to_base64_str(mat: cv2.typing.MatLike):
    mat = cv2.cvtColor(mat, cv2.COLOR_BGR2RGB)
    _, buff = cv2.imencode(".jpg", mat)
    b64 = base64.b64encode(buff)

    return b64.decode("utf8")


def convert_to_body(object):
    for v in object:
        if v["image"] is None or v["image"].size == 0:
            print(f"Skipping invalid image: {v}")
    return list(map(lambda v: {**v, "image": cv_to_base64_str(v["image"])}, object))
