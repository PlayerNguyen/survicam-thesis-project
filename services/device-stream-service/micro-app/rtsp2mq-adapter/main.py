import cv2
import pika
import sys
import base64
import json
import os
import datetime
from observer import Observer


if __name__ == "__main__":
    # print(cv2.getBuildInformation())
    if len(sys.argv) < 3 or len(sys.argv) > 4:
        print("Usage: python observer.py <rtsp_url> <rabbitmq_uri> [device_id]")
        sys.exit(1)

    rtsp_uri = sys.argv[1]
    message_queue_uri = sys.argv[2]
    device_id = sys.argv[3] if len(sys.argv) == 4 else "Unknown Id"
    print("Starting observing application...")
    observer = Observer(
        device_id=device_id, rtsp_uri=rtsp_uri, message_queue_uri=message_queue_uri
    )
    observer.start()
