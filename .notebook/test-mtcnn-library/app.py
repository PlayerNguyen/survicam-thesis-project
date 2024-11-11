import cv2

from fastmtcnn import FastMTCNN
import base64
import os
import torch
from pprint import pprint

output_model = os.path.join(os.path.dirname(__file__), "../data")


def get_device():
    return "cuda" if torch.cuda.is_available() else "cpu"


print(f"Output of the model: {output_model}")

detector = FastMTCNN(
    stride=4,
    resize=0.5,
    margin=14,
    factor=0.5,
    keep_all=True,
    device="cuda" if torch.cuda.is_available() else "cpu",
)

# cap = cv2.VideoCapture("rtsp://admin123:27032002@192.168.1.6/stream1")
cap = cv2.VideoCapture(0)


def cv_to_base64_str(mat):
    _, buff = cv2.imencode(".jpg", mat)
    b64 = base64.b64encode(buff)

    return b64.decode("utf8")


def convert_to_body(object):
    return list(map(lambda v: {**v, "image": cv_to_base64_str(v["image"])}, object))


frames = []
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
    frames.append(frame)
    result = detector(frames)
    if len(result) > 0:
        print(type(result[0]))
        pprint(result, depth=2, width=50)
        # cv2.imshow("Face", result[0])
        # b64_str = img_to_b64_str(result[0].tobytes())
    # visualize(frame, result)
    cv2.imshow("Window", frame)
    frames = []

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
