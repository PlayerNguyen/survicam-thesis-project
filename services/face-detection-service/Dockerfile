FROM python:3.12

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY ./app /code/app

CMD ["python", "/code/app/main.py"]
