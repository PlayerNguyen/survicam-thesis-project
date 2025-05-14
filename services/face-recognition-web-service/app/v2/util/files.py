import cv2
import os
import base64
import mimetypes


def get_store_dir():
    return os.path.join(os.getcwd(), ".data", "store")


def ensure_store_dir():
    if not os.path.exists(get_store_dir()):
        os.makedirs(get_store_dir())


def store(mat: cv2.typing.MatLike, name: str):
    ensure_store_dir()

    cv2.imwrite(os.path.join(get_store_dir(), name), mat)


def read(name: str):
    return cv2.imread(name)


def get_file_path(name: str):
    return os.path.join(get_store_dir(), name)


def read_as_b64(name: str):
    img = cv2.imread(name)
    _, buff = cv2.imencode(".jpg", img)
    return base64.b64encode(buff).decode("utf8")


def exists(name: str) -> bool:
    return os.path.join(get_store_dir(), name)


def is_acceptable_file(file_name):
    # Get the MIME type of the file
    mime_type, _ = mimetypes.guess_type(file_name)

    # Define acceptable MIME types
    acceptable_mime_types = {"image/jpeg", "image/png"}

    # Check if the MIME type is acceptable
    return mime_type in acceptable_mime_types
