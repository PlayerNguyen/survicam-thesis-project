import cv2

cap = cv2.VideoCapture("rtsp://localhost:8554/stream2")
retry = 0
max_retry = 1000
while True:
    ret, frame = cap.read()

    if not ret:
        retry += 1
        if retry >= max_retry:
            raise "Unable to read the capture data (reached max retry)."
        else:
            continue

    print(ret, frame)
