from fastapi import APIRouter, UploadFile, File, HTTPException, Query, BackgroundTasks
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime
from fastapi.encoders import jsonable_encoder
import uuid
from .util import milvus as milvusUtil
from .util.files import store, get_file_path, read, is_acceptable_file
from .util import embeddings
import numpy as np
import cv2
from bson import ObjectId
import logging

logger = logging.getLogger("V2Engine")

# Initialize router
router = APIRouter()

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["members"]

# Ensure collection exists
# collection_name = "members"
# if collection_name not in db.list_collection_names():
#     db.create_collection(collection_name)

collection = db["members"]


# Pydantic Models
class Member(BaseModel):
    name: str
    avatar: Optional[str] = None
    createdAt: datetime = datetime.utcnow()
    updatedAt: datetime = datetime.utcnow()


class Resource(BaseModel):
    imageAbsolutePath: str
    resourceRef: str
    createdAt: datetime = datetime.utcnow()
    updatedAt: datetime = datetime.utcnow()


# Endpoints
@router.post("/members")
async def create_member(member: Member):
    member_data = jsonable_encoder(member)

    # milvus_ref = milvus_result["ids"][0]
    result = collection.insert_one(member_data)
    inserted_id = str(result.inserted_id)

    milvus_result = await milvusUtil.create_empty_member(member.name, inserted_id)

    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to insert member")
    return {
        "id": inserted_id,
        "message": "Member added successfully",
    }


@router.get("/members")
def get_members(name: Optional[str] = Query(None)):
    query = {"deleted": {"$ne": True}}  # Exclude soft-deleted members
    if name:
        query["name"] = {"$regex": name, "$options": "i"}  # Apply name search filter

    members = list(collection.find(query))  # Fetch all fields including `_id`

    # Convert ObjectId to string for JSON serialization
    for member in members:
        member["_id"] = str(member["_id"])

    return {"members": members}


@router.put("/members/{memberId}")
async def update_member(memberId: str, member: Member):
    update_data = jsonable_encoder(
        {k: v for k, v in member.dict().items() if v is not None}
    )
    update_data["updatedAt"] = datetime.utcnow()

    try:
        member_id_object = ObjectId(memberId)
    except:
        raise HTTPException(
            status_code=400, detail="Invalid memberId or resourceId format"
        )

    result = collection.update_one({"_id": member_id_object}, {"$set": update_data})

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")

    await milvusUtil.set_name_on_primary(memberId, update_data["name"])
    return {"message": "Member updated successfully"}


@router.get("/members/{memberId}")
def get_member_by_id(memberId: str):
    try:
        member_object_id = ObjectId(memberId)
    except:
        raise HTTPException(status_code=400, detail="Invalid memberId format")

    # Find the member by ID
    member = collection.find_one({"_id": member_object_id})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Convert ObjectId to string for JSON response
    member["_id"] = str(member["_id"])
    for resource in member.get("resources", []):
        resource["_id"] = str(resource["_id"])

    return {"member": member}


@router.delete("/members/{memberId}")
def soft_delete_member(memberId: str):
    result = collection.update_one({"_id": memberId}, {"$set": {"deleted": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Member soft-deleted successfully"}


@router.post("/members/search")
async def search_test(files: List[UploadFile] = File(...)):
    result = []
    for idx, file in enumerate(files):
        if not is_acceptable_file(file.filename):
            raise HTTPException(
                status_code=422,
                detail={
                    "success": False,
                    "message": f"File at index {idx} have a unprocessable extension. Acceptable extension are .jpeg, .jpg, and .png",
                },
            )

        print(f"Searching face in file {file.filename}")

        current_file = await file.read()
        current_file = await embeddings.file_to_mat(current_file)

        faces = await embeddings.detect_and_embed_bounding_box_and_images(current_file)
        # If
        if len(faces) == 0:
            continue

        for idx, face in enumerate(faces):
            current_embedding = face["embeddings"].detach().cpu().tolist()
            find_result = await milvusUtil.find_similarity(current_embedding)
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


@router.put("/members/{memberId}/resources")
async def add_resources(
    background_tasks: BackgroundTasks,
    memberId: str,
    files: List[UploadFile] = File(...),  # Accept multiple files
):
    try:
        member_object_id = ObjectId(memberId)
    except:
        raise HTTPException(status_code=400, detail="Invalid memberId format")

    # Fetch the member from MongoDB
    member = collection.find_one({"_id": member_object_id})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    resources = []

    for idx, file in enumerate(files):
        file_bytes = await file.read()
        np_arr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image format at index {idx} ({file.filename})",
            )

        # Process image (Face detection)
        faces_tensor = await embeddings.detect_faces_in_images(img)

        # Convert to list of face bounding boxes
        faces = (
            faces_tensor.cpu().numpy().tolist()
            if faces_tensor.is_cuda
            else faces_tensor.numpy().tolist()
        )

        if not faces or len(faces) > 1:
            raise HTTPException(
                status_code=400,
                detail=f"No (or multiple) faces found in the image {file.filename}",
            )

        top_image = faces_tensor[0]
        cur_emb = await embeddings.embeddings_only(top_image)

        # Store the image
        unique_filename = f"{uuid.uuid4()}.jpg"
        store(img, unique_filename)

        # Create resource entry
        resource_id = str(ObjectId())
        resource = {
            "_id": resource_id,
            "imageAbsolutePath": get_file_path(unique_filename),
            "resourceRef": str(uuid.uuid4()),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        }

        resources.append(resource)

        # Store embedding in history
        await milvusUtil.add_history_embedding(
            resource_id, memberId, cur_emb.squeeze(0).detach().numpy()
        )

    # Update MongoDB document
    result = collection.update_one(
        {"_id": member_object_id}, {"$push": {"resources": {"$each": resources}}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")

    # Trigger background task to update member embeddings
    background_tasks.add_task(milvusUtil.recompute_member_embedding, memberId)

    return {"message": "Resources added successfully", "resources": resources}


@router.delete("/members/{memberId}/resources/{resourceId}")
async def delete_resource(
    background_tasks: BackgroundTasks, memberId: str, resourceId: str
):
    print(memberId, resourceId)
    # Convert memberId and resourceId to ObjectId
    try:
        member_object_id = ObjectId(memberId)

    except:
        raise HTTPException(
            status_code=400, detail="Invalid memberId or resourceId format"
        )

    # Check if the member exists and contains the resource
    member = collection.find_one({"_id": member_object_id, "resources._id": resourceId})

    print(member)

    if not member:
        raise HTTPException(status_code=404, detail="Member or resource not found")

    # Remove the history from the milvus
    milvus_response = await milvusUtil.remove_history(resourceId)
    logger.info(milvus_response)

    # Remove the resource from the member's resources list
    result = collection.update_one(
        {"_id": member_object_id}, {"$pull": {"resources": {"_id": resourceId}}}
    )

    # Trigger background task to update the member embedding
    background_tasks.add_task(milvusUtil.recompute_member_embedding, memberId)

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete resource")

    return {"message": "Resource deleted successfully"}


from fastapi.responses import Response


@router.get("/members/{memberId}/resources/{resourceId}")
async def get_resource_from_member(memberId: str, resourceId: str):
    try:
        member_object_id = ObjectId(memberId)
    except:
        raise HTTPException(status_code=400, detail="Invalid memberId format")

    # Find the member and check if the resource exists
    member = collection.find_one({"_id": member_object_id, "resources._id": resourceId})

    if not member:
        raise HTTPException(status_code=404, detail="Member or resource not found")

    # Retrieve the resource metadata
    resource = next(
        (res for res in member["resources"] if res["_id"] == resourceId), None
    )

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found in this member")

    # Get the image path and read the file
    image_path = resource["imageAbsolutePath"]
    img = read(image_path)

    if img is None:
        raise HTTPException(status_code=500, detail="Failed to read image file")

    # Encode the image as JPEG
    _, img_encoded = cv2.imencode(".jpg", img)
    return Response(content=img_encoded.tobytes(), media_type="image/jpeg")


import base64
from fastapi import UploadFile, File


@router.put("/members/{memberId}/avatar")
async def update_avatar(memberId: str, file: UploadFile = File(None)):
    try:
        member_object_id = ObjectId(memberId)
    except:
        raise HTTPException(status_code=400, detail="Invalid memberId format")

    # If no file is provided, reset the avatar to null
    if file is None:
        result = collection.update_one(
            {"_id": member_object_id}, {"$set": {"avatar": None}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Member not found")
        return {"message": "Avatar removed successfully"}

    # Read the file and convert to base64
    file_bytes = await file.read()
    avatar_base64 = base64.b64encode(file_bytes).decode("utf-8")

    # Update the database with the base64 avatar
    result = collection.update_one(
        {"_id": member_object_id}, {"$set": {"avatar": avatar_base64}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")

    return {"message": "Avatar updated successfully"}
