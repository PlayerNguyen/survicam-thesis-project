import cv2
import asyncio


def try_to_open(v):
    device = v if v != "internal" else 0
    print(f"Opening a video capture with device {device}")
    cap = cv2.VideoCapture(device)

    if cap is None or not cap.isOpened():
        raise "Unable to open device."

    return cap


def create_generator(cap: cv2.VideoCapture, scale: float | None):

    while True:
        # for cap in caps:
        # # Capture frame-by-frame
        success, frame = cap.read()  # read the camera frame
        if not success:
            break

        # if we need to resize factor
        if scale is not None:

            w, h, _ = frame.shape
            frame = cv2.resize(frame, (int(h * scale), int(w * scale)))

        ret, buffer = cv2.imencode(".jpg", frame)
        frame = buffer.tobytes()
        yield (b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")
    cap.release()


async def streamer(gen):
    try:
        for i in gen:
            yield i
            await asyncio.sleep(0.02)
    except asyncio.CancelledError:
        print("The stream was closed. [reason: user cancelled]")
