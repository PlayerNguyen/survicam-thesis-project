import cv2
from facenet_pytorch import InceptionResnetV1, MTCNN
from torchvision.transforms.functional import to_tensor
import torch
import numpy as np
from PIL import Image
from typing import Union

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
resnet = InceptionResnetV1(pretrained="vggface2", device=device).eval()
detector = MTCNN(
    image_size=160,
    factor=0.706,
    keep_all=True,
    post_process=True,
    device=device,
)


async def file_to_mat(file):
    img = np.frombuffer(file, dtype=np.uint8)
    img = cv2.imdecode(img, flags=1)
    return img


async def image_to_embeddings(image: cv2.typing.MatLike) -> torch.Tensor:
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(image)
    # image = pil_to_tensor(image)
    image = to_tensor(image).to(device=device)
    print(image.size())
    result = resnet(image.unsqueeze(0))
    return result


async def detect_faces_in_images(
    image: cv2.typing.MatLike,
) -> Union[torch.Tensor, tuple[torch.tensor, float]]:
    return detector(image)


async def embeddings_only(tensor: torch.Tensor) -> torch.Tensor:
    return resnet(tensor.unsqueeze(0))


async def detect_and_embed_bounding_box_and_images(
    image: cv2.typing.MatLike,
) -> list[dict]:
    image = cv2.resize(image, None, fx=0.4, fy=0.4)
    bbs, probs = detector.detect(image)

    result = []
    if bbs is None:
        return result

    for _, (box, prob) in enumerate(zip(bbs, probs)):

        face = {}
        box = [max(0, int(v)) for v in box]
        print(f"{box} {prob}")

        # crop image
        face["face_area"] = box
        face["confidence"] = prob
        current_face_image = image[box[1] : box[3], box[0] : box[2]]
        current_face_image = cv2.resize(current_face_image, (160, 160))
        # cv2.imwrite(f"{_}.jpg", current_face_image)
        # print(np.array(current_face_image))

        face["image"] = current_face_image
        face["embeddings"] = resnet(to_tensor(current_face_image).unsqueeze(0))

        result.append(face)

    return result
