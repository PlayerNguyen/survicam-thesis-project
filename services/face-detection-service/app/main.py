from dotenv import load_dotenv

load_dotenv()

from detection_request import handle_request_from_devices


if __name__ == "__main__":
    print("Starting an agent")
    handle_request_from_devices()
