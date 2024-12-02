from pymilvus import (
    MilvusClient,
    connections,
    CollectionSchema,
    FieldSchema,
    DataType,
    Collection,
    Index,
)
import os
import numpy as np
import cv2
import time
import uuid

client = MilvusClient(uri=os.getenv("MILVUS_CONNECTION_URI"))
# connections.connect("default", uri=os.getenv("MILVUS_CONNECTION_URI"))

PRIMARY_EMBEDDING_COLLECTION_NAME = "primary_face_embeddings"
HISTORY_FACE_COLLECTION_NAME = "history_face_embeddings"


primary_face_embeddings_schema = CollectionSchema(
    fields=[
        # id
        FieldSchema("id", dtype=DataType.VARCHAR, is_primary=True, max_length=36),
        FieldSchema("name", dtype=DataType.VARCHAR, max_length=255),
        # vector
        FieldSchema(
            "embeddings",
            dtype=DataType.FLOAT_VECTOR,
            dim=512,
        ),
        FieldSchema(
            "updated_at",
            dtype=DataType.INT64,
        ),
    ],
    description="The primary face embeddings collection",
)

if not client.has_collection(collection_name=PRIMARY_EMBEDDING_COLLECTION_NAME):
    client.create_collection(
        collection_name=PRIMARY_EMBEDDING_COLLECTION_NAME,
        schema=primary_face_embeddings_schema,
    )

embedding_primary_index_params = MilvusClient.prepare_index_params()
embedding_primary_index_params.add_index(
    field_name="embeddings",
    index_type="IVF_FLAT",
    metric_type="COSINE",
    params={"nlist": 512},
)

client.create_index(
    collection_name=PRIMARY_EMBEDDING_COLLECTION_NAME,
    index_params=embedding_primary_index_params,
    sync=False,
)

history_face_embeddings_schema = CollectionSchema(
    fields=[
        FieldSchema("id", dtype=DataType.VARCHAR, is_primary=True, max_length=36),
        FieldSchema("owner", dtype=DataType.VARCHAR, max_length=36),
        FieldSchema(
            "image",
            dtype=DataType.VARCHAR,
            max_length=65535,
        ),
        FieldSchema(
            "embedding",
            dtype=DataType.FLOAT_VECTOR,
            dim=512,
        ),
        FieldSchema(
            "created_at",
            dtype=DataType.INT64,
        ),
    ],
    description="The history face embeddings collection",
)

history_face_embedding_params = MilvusClient.prepare_index_params()
history_face_embedding_params.add_index(
    field_name="embedding",
    index_type="IVF_FLAT",
    metric_type="COSINE",
    params={"nlist": 512},
)
client.create_index(
    collection_name=HISTORY_FACE_COLLECTION_NAME,
    index_params=history_face_embedding_params,
    sync=False,
)

if not client.has_collection(collection_name=HISTORY_FACE_COLLECTION_NAME):
    client.create_collection(
        collection_name=HISTORY_FACE_COLLECTION_NAME,
        schema=history_face_embeddings_schema,
    )


async def get_all_members(limit: int = 12, page: int = 1, **kwargs):
    client.load_collection(PRIMARY_EMBEDDING_COLLECTION_NAME)
    start = limit * (page - 1)
    end = start + limit
    count = client.query(PRIMARY_EMBEDDING_COLLECTION_NAME, output_fields=["count(*)"])[
        0
    ]["count(*)"]
    result = client.query(
        PRIMARY_EMBEDDING_COLLECTION_NAME,
        limit=end,
        output_fields=[
            "id",
            "name",
            "updated_at",
        ],
        kwargs=kwargs,
    )

    return [result[start:end], count]


async def create_empty_member(name: str):
    """
    Creates a member vector with random embeddings. This one
    suitable for initial a new member.
    """

    return client.insert(
        collection_name=PRIMARY_EMBEDDING_COLLECTION_NAME,
        data=[
            {
                "id": str(uuid.uuid4()),
                "name": name,
                "embeddings": np.random.rand(512).tolist(),
                "updated_at": int(time.time()),
            }
        ],
    )


async def get_member(id: str):
    # Load the member
    client.load_collection(PRIMARY_EMBEDDING_COLLECTION_NAME, timeout=100)
    return client.get(
        PRIMARY_EMBEDDING_COLLECTION_NAME,
        ids=[id],
        output_fields=[
            "id",
            "name",
            "updated_at",
        ],
    )


async def add_history_embedding(
    owner: str,
    image: str,
    embedding: np.ndarray,
):
    return client.insert(
        collection_name=HISTORY_FACE_COLLECTION_NAME,
        data=[
            {
                "id": str(uuid.uuid4()),
                "owner": owner,
                "image": image,
                "embedding": embedding.tolist(),
                "created_at": int(time.time()),
            }
        ],
    )


async def get_history_by_member(id: str):
    client.load_collection(HISTORY_FACE_COLLECTION_NAME, timeout=100)
    return client.query(
        HISTORY_FACE_COLLECTION_NAME,
        filter=f'owner=="{id}"',
        output_fields=[
            "id",
            "owner",
            "image",
            "created_at",
        ],
    )


async def recompute_member_embedding(id: str):
    client.load_collection(HISTORY_FACE_COLLECTION_NAME, timeout=100)
    print(f"Recomputing member embedding of member's id: {id}")
    ls = client.query(
        HISTORY_FACE_COLLECTION_NAME,
        filter=f'owner=="{id}"',
        output_fields=[
            "embedding",
        ],
    )

    member_data = client.get(
        PRIMARY_EMBEDDING_COLLECTION_NAME,
        ids=[id],
        output_fields=[
            "name",
        ],
    )[0]

    values = list(map(lambda v: v["embedding"], ls))
    if len(values) == 0:
        values = [np.random.rand(512)]
    # average all embeddings
    values = np.average(values, 0)

    # now we adding back to the element
    result = client.upsert(
        collection_name=PRIMARY_EMBEDDING_COLLECTION_NAME,
        data=[
            {
                "id": id,
                "embeddings": values.tolist(),
                "name": member_data["name"],
                "updated_at": int(time.time()),
            }
        ],
    )

    print(result)


async def find_similarity(data: list[list], radius: float = 0.56):
    client.load_collection(PRIMARY_EMBEDDING_COLLECTION_NAME, timeout=120)
    return client.search(
        PRIMARY_EMBEDDING_COLLECTION_NAME,
        data=data,
        search_params={"params": {"radius": radius}},
    )
