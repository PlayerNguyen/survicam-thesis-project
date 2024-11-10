import json
import cv2
import base64
import numpy as np
from PIL import Image
import io
import os
from deepface.DeepFace import extract_faces
from mqueue import channel
import pprint
from sender import Sender

sender = Sender()


class Detector:
    def __init__(self):
        pass

    def do_detect(self, body):
        json_response = json.loads(body)

        # print()
        # print(json_response["timestamp"])
        img_data = json_response["frame_data"]

        # pre-process image
        img = base64.b64decode(img_data)
        img = Image.open(io.BytesIO(img))
        img = np.asarray(img)
        img = cv2.resize(img, (0, 0), fx=0.3, fy=0.3)
        v = extract_faces(
            img,
            enforce_detection=False,
            detector_backend=os.getenv("FACE_DETECT_MODEL"),
            normalize_face=True,
            align=True,
        )

        # omit if the bounding box is empty (or confidence is equal 0)
        v = ignore_none_bounding_box(v)

        # normalize information before submit
        if len(v) > 0:
            body = {
                "camera_id": json_response["camera_id"],
                "detections": list(
                    map(
                        lambda response: {
                            "facial_area": {**response["facial_area"]},
                            "face": np_array_to_base64_str(response["face"] * 255),
                            "confidence": response["confidence"],
                        },
                        v,
                    )
                ),
            }
            # pprint.pprint(body)
            print("sending data to the recognition service")
            # send to next pipe
            sender.post(body)

    def chunk(self, channel, method_frame, header_frame, body):
        print(f"Fetching delivered tag number #{method_frame.delivery_tag}")
        self.do_detect(body)
        channel.basic_ack(delivery_tag=method_frame.delivery_tag)


detector = Detector()
# Set up a channel
face_detection_queue_name = channel.queue_declare(
    queue="device.face_detection_queue",
    arguments={"x-max-length": 100, "x-message-ttl": 10000},
).method.queue

channel.basic_qos(prefetch_count=1)


def ignore_none_bounding_box(arr):
    return list(filter(lambda face: face["confidence"] > 0, arr))


def np_array_to_base64_str(frame):
    _, buff = cv2.imencode(".jpg", frame)
    b64 = base64.b64encode(buff)

    return b64.decode("utf8")


def handle_request_from_devices():
    channel.basic_consume(
        queue="device.face_detection_queue", on_message_callback=detector.chunk
    )
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
