import json
import cv2
import base64
import numpy as np
from PIL import Image
import io
import torch
import logging
from logging import Logger
from mqueue import channel
from sender import Sender
from detect.fastmtcnn import FastMTCNN, convert_to_body

logging.basicConfig()
logging.getLogger().setLevel(logging.INFO)
logger = Logger("Detection")


sender = Sender()
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Currently using {device}, is_cuda_available: {torch.cuda.is_available()}")
detect_model = FastMTCNN(
    stride=4,
    resize=1,
    margin=14,
    factor=0.76,
    keep_all=True,
    device="cuda" if torch.cuda.is_available() else "cpu",
)


class Detector:
    def __init__(self):
        self.frames = []

    def do_detect(self, body):
        json_response = json.loads(body)

        # print()
        # print(json_response["timestamp"])
        img_data = json_response["frame_data"]

        # pre-process image
        img = base64.b64decode(img_data)
        img = Image.open(io.BytesIO(img))
        img = np.asarray(img)

        # omit if the bounding box is empty (or confidence is equal 0)
        self.frames.append(img)
        result = detect_model(self.frames)

        self.frames = []

        # normalize information before submit
        if len(result) > 0:

            result = convert_to_body(result)
            body = {
                "camera_id": json_response["camera_id"],
                "detections": result,
            }
            # pprint.pprint(body)
            print("Face detected. Start sending data to the recognition service")
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
        print(f"Begining to consume from message queue...")
        channel.start_consuming()
    except KeyboardInterrupt:
        print(f"Interrupted. Stop consuming from the message queue...")
        channel.stop_consuming()
