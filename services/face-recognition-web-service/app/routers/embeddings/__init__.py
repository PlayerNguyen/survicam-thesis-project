from fastapi import APIRouter, UploadFile
from utils import embeddings
import base64

router = APIRouter()


@router.post(
    "/file",
    summary="Convert image file into vector embeddings",
    description="Convert the image file into embeddings vector. The uploaded file must be in image format.",
)
async def convert_image_file_to_embeddings(files: list[UploadFile]):
    resp = []
    for file in files:
        cur_data = await file.read()
        value = await embeddings.file_to_mat(cur_data)
        value = await embeddings.image_to_embeddings(value)
        value = value.cpu().data.numpy().tobytes()
        value = base64.b64encode(value).decode("utf-8")
        resp.append(value)

    return {"data": resp}

