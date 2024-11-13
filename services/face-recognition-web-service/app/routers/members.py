from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from typing import Annotated, List
from ..milvus import (
    create_empty_member,
    get_member,
    add_history_embedding,
    get_history_by_member,
    recompute_member_embedding,
    find_similarity,
)
from pydantic import BaseModel
from ..utils import embeddings
import base64
import cv2
import os
from store import image_store
import uuid

router = APIRouter()


class CreateNewMemberBody(BaseModel):
    name: str


@router.post(
    "/",
    summary="Create a new member",
    description="Create a new member with random embeddings value",
)
async def create_new_member(item: CreateNewMemberBody):
    result = await create_empty_member(item.name)
    if result["insert_count"] < 1:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "message": "Cannot create an empty user."},
        )
    return {"success": True, "data": {"id": result["ids"][0]}}


@router.get(
    "/{id}", summary="Get member by id", description="Get a member information by id"
)
async def get_member_by_id(id: str):
    result = await get_member(id=id)
    if len(result) == 0:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": "Cannot find this member with specific id.",
            },
        )
    history_result = await get_history_by_member(id)
    return {
        "success": True,
        "data": {"member": result[0], "history": history_result},
    }


@router.post("/search")
async def search_test(files: List[UploadFile] = File(...)):
    result = []
    for idx, file in enumerate(files):
        _, ext = os.path.splitext(file.filename)
        accept_ext = set([".jpeg", ".jpg", ".png"])
        if ext not in accept_ext:
            raise HTTPException(
                status_code=422,
                detail={
                    "success": False,
                    "message": f"File at index {idx} have a unprocessable extension. Acceptable extension are .jpeg, .jpg, and .png",
                },
            )

        print(f"Searching face in file {_}")

        current_file = await file.read()
        current_file = await embeddings.file_to_mat(current_file)

        faces = await embeddings.detect_and_embed_bounding_box_and_images(current_file)
        # If
        if len(faces) == 0:
            continue

        for idx, face in enumerate(faces):
            current_embedding = face["embeddings"].detach().cpu().tolist()
            find_result = await find_similarity(current_embedding)
            faces[idx]["result"] = find_result

        res_object = list(
            map(
                lambda face: {
                    "face_area": face["face_area"],
                    "confidence": face["confidence"],
                    "result": face["result"],
                },
                faces,
            )
        )
        result.append(res_object)
        # pp(res_object, depth=2, compact=True)

    return {"data": result}


@router.post(
    "/{id}",
    summary="Upload face asset of member",
    description="Upload images nto a history database, the list of images must only have one face and only one, the request will response fail if more or less. The uploaded file be store in the data and the embedding of member will be re-calculate by taking average.",
)
async def update_face_asset(
    background_tasks: BackgroundTasks,
    id: str,  # Path parameter
    files: List[UploadFile] = File(...),  # Body parameter,
):
    # Check if user is exists
    members = await get_member(id)
    if len(members) == 0:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Cannot found the member with id {id}",
            },
        )

    for idx, file in enumerate(files):
        _, ext = os.path.splitext(file.filename)
        accept_ext = set([".jpeg", ".jpg", ".png"])
        if ext not in accept_ext:
            raise HTTPException(
                status_code=422,
                detail={
                    "success": False,
                    "message": f"File at index {idx} have a unprocessable extension. Acceptable extension are .jpeg, .jpg, and .png",
                },
            )

        print(f"Processing file: {file.filename} for member ID: {id}")

        current_file = await file.read()
        current_file = await embeddings.file_to_mat(current_file)

        images = await embeddings.detect_faces_in_images(current_file)

        if images is None or len(images) > 1 or len(images) <= 0:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "message": f"No (or more than one) face found in the image at index {idx}. The file named {_}",
                },
            )

        top_image = images[0]
        cur_emb = await embeddings.embeddings_only(top_image)

        # Store the file and give the addr only
        stored_filename = str(uuid.uuid4()) + ".jpg"
        image_store.store(current_file, stored_filename)

        await add_history_embedding(
            id, stored_filename, cur_emb.squeeze(0).detach().numpy()
        )

    # Recompute a new embedding
    background_tasks.add_task(recompute_member_embedding, id)
    return {"success": True, "message": "Files was uploaded and processed"}
