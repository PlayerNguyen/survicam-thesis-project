import os
import json
from pprint import pp
import base64
from PIL import Image
import io
import cv2
import numpy as np
from embeddings import embedding_image
from milvus import find_similarity, find_single_result_similarity
import json
import requests
import logging

from io import BytesIO

# Read API base URL from environment variable, with a default fallback
LOGGING_API_BASE_URL = os.getenv("LOGGING_API_BASE_URL", "http://localhost:3000")
APP_RECOGNITION_THRESHOLD = os.getenv("APP_RECOGNITION_THRESHOLD", 0.45)

logging.basicConfig(level=logging.INFO)

def pil_to_base64(image: Image.Image) -> str:
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

def b64_str_to_img(base64_string: str) -> Image.Image:
    imgdata = base64.b64decode(base64_string)
    res: Image.Image = Image.open(io.BytesIO(imgdata))
    return res

def process_image(image):
    """Process an image, compute its embedding, and send a POST request with both embedding and image data."""
    try:
        # Convert image to embedding tensor
        embedding_tensor = embedding_image(image).detach().cpu().tolist()

        # Find similarity
        similarity_result = find_similarity(embedding_tensor)
        single_similarity_result = find_single_result_similarity(embedding_tensor, threshold=float(APP_RECOGNITION_THRESHOLD))
        response_data = similarity_result[0]

        # only select one entity inside the response
        if len(single_similarity_result[0]) == 0:
            single_similarity_result = None
        else:
            single_similarity_result = single_similarity_result[0][0]

        try:
            # Get base64 representation of the original image
            image_base64 = pil_to_base64(image)
        except Exception as e:
            logging.error(f"Error converting image to Base64: {e}")
            raise  # Reraise the exception

        # Combine response data with image Base64 for the POST request
        combined_data = {'similarity': response_data, 'image': image_base64, 'predict_result': single_similarity_result}
        logging.info(f"The similarity response data: {response_data}")
        logging.info(f"Start sending a HTTP request to {LOGGING_API_BASE_URL}/logging/")
        # Send POST request
        response = requests.post(f"{LOGGING_API_BASE_URL}/logging/", json=combined_data)
        logging.info(f"Response Status Code: {response.status_code}, Response Body: {response.text}")

    except requests.RequestException as req_err:
        logging.error(f"HTTP Request Error: {req_err}")
    except RuntimeError as e:
        if "Kernel size can't be greater than actual input size" in str(e):
                print("Skipping image due to insufficient size after padding.")
                return None  # Or handle it differently if needed
        else:
                raise  # Re-raise other unexpected runtime errors
    except Exception as err:
        logging.error(f"Unexpected error: {err}", exc_info=True)
        raise  # Reraise the exception for debugging or higher-level handling


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
            process_image(image)
            # try:
            #     embedding_tensor = embedding_image(image)
            #     embedding_tensor = embedding_tensor.detach().cpu().tolist()
            #     response_str = json.dumps(find_similarity(embedding_tensor)[0])
            #     print(response_str)
            #     print(f"Successfully compressed the embeddng tensor")
            #     # print()
            #     resp = requests.post(f"http://localhost:3000/logs/", json=response_str)
            #     print(resp)
            # except Exception as err:
            #     print(f"Unexpected {err=}, {type(err)=}")
            #     raise

        channel.basic_ack(method.delivery_tag)
