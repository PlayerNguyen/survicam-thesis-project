import os
import json
from pprint import pp
import base64
from PIL import Image
import io
import cv2
import numpy as np
from embeddings import embedding_image
from milvus import find_similarity


def b64_str_to_img(base64_string: str) -> Image.Image:
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))


def pil_to_rgb(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)


class Callback:
    def __init__(self):
        self.pid = os.getpid()
        # Create a simple storage to write face images (for preview only)
        self.preview_storage_path = os.path.join(os.getcwd(), "./.data")

        if not os.path.exists(self.preview_storage_path):
            os.mkdir(self.preview_storage_path)

    def on_receive(self, channel, method, properties, body):
        print(f" [{self.pid}] Receiving from detection message queue:")
        json_body = json.loads(body)
        # pp(json_body, depth=3)

        detections = json_body["detections"]
        print(f"Detect {len(detections)} faces. Embedding it.")

        for idx, detection_result in enumerate(detections):
            image = detection_result["image"]
            # convert to PIL.Image and save for previewing
            image = b64_str_to_img(image)
            image = image.resize((160, 160))
            image.save(os.path.join(self.preview_storage_path, f"{idx}.jpeg"))

            # Embedding the image into a embedding vector
            try:
                embedding_tensor = embedding_image(image)
                embedding_tensor = embedding_tensor.detach().cpu().tolist()
                pp(find_similarity(embedding_tensor))
            except:
                pp("Something happend while embedding")

        channel.basic_ack(method.delivery_tag)
