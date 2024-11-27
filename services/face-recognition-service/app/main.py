from dotenv import load_dotenv

print(f"Loading the environment: {load_dotenv()}")

import os


if __name__ == "__main__":
    from message_queue import consume_from_message_queue

    print(f"Starting face recognition service [pid: {os.getpid()}]")
    consume_from_message_queue()
