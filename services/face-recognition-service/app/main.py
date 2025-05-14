from dotenv import load_dotenv
import os


if __name__ == "__main__":
    print(f"Starting the application...")
    print(f"Loading the environment: {load_dotenv()}")
    from message_queue import consume_from_message_queue

    print(f"Starting face recognition service [pid: {os.getpid()}]")
    consume_from_message_queue()
