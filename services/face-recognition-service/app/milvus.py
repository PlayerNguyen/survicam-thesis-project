from pymilvus import FieldSchema, CollectionSchema, DataType, MilvusClient
import os

client = MilvusClient(uri=os.getenv("MILVUS_CONNECTION_URI"))

# PRIMARY_EMBEDDING_COLLECTION_NAME = "primary_face_embeddings"
# HISTORY_FACE_COLLECTION_NAME = "history_face_embeddings"


# primary_face_embeddings_schema = CollectionSchema(
#     fields=[
#         # id
#         FieldSchema("id", dtype=DataType.VARCHAR, is_primary=True, max_length=36),
#         FieldSchema("name", dtype=DataType.VARCHAR, max_length=255),
#         # vector
#         FieldSchema(
#             "embeddings",
#             dtype=DataType.FLOAT_VECTOR,
#             dim=512,
#         ),
#         FieldSchema(
#             "updated_at",
#             dtype=DataType.INT64,
#         ),
#     ],
#     description="The primary face embeddings collection",
# )

# client.create_collection(
#     collection_name=PRIMARY_EMBEDDING_COLLECTION_NAME,
#     schema=primary_face_embeddings_schema,
# )

# embedding_primary_index_params = MilvusClient.prepare_index_params()
# embedding_primary_index_params.add_index(
#     field_name="embeddings",
#     index_type="IVF_FLAT",
#     metric_type="COSINE",
#     params={"nlist": 512},
# )

# client.create_index(
#     collection_name=PRIMARY_EMBEDDING_COLLECTION_NAME,
#     index_params=embedding_primary_index_params,
#     sync=False,
# )

# history_face_embeddings_schema = CollectionSchema(
#     fields=[
#         FieldSchema("id", dtype=DataType.VARCHAR, is_primary=True, max_length=36),
#         FieldSchema("owner", dtype=DataType.VARCHAR, max_length=36),
#         FieldSchema(
#             "image",
#             dtype=DataType.VARCHAR,
#             max_length=65535,
#         ),
#         FieldSchema(
#             "embedding",
#             dtype=DataType.FLOAT_VECTOR,
#             dim=512,
#         ),
#         FieldSchema(
#             "created_at",
#             dtype=DataType.INT64,
#         ),
#     ],
#     description="The history face embeddings collection",
# )

# client.create_collection(
#     collection_name=HISTORY_FACE_COLLECTION_NAME, schema=history_face_embeddings_schema
# )
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
if not client.has_collection(collection_name=HISTORY_FACE_COLLECTION_NAME):
    client.create_collection(
        collection_name=HISTORY_FACE_COLLECTION_NAME,
        schema=history_face_embeddings_schema,
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


def find_similarity(data: list[list], radius: float = 0.26):
    client.load_collection(PRIMARY_EMBEDDING_COLLECTION_NAME, timeout=120)
    return client.search(
        PRIMARY_EMBEDDING_COLLECTION_NAME,
        data=data,
        limit=5,
        # search_params={"params": {"radius": radius}},
    )
