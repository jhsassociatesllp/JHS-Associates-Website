"""Create (idempotently) the standard dense-vector Pinecone index used with OpenAI embeddings.
The dimension is taken from EMBEDDING_DIMENSIONS so index and embeddings can never disagree.
Usage (from ai-assistant/):  python -m scripts.create_index"""
from pinecone import Pinecone, ServerlessSpec

from app.core.config import get_settings


def main() -> None:
    s = get_settings()
    pc = Pinecone(api_key=s.pinecone_api_key)
    name = s.ai_pinecone_index
    if pc.has_index(name):
        d = pc.describe_index(name)
        if int(d.dimension) != s.embedding_dimensions:
            raise SystemExit(f"Index {name} exists with dimension {d.dimension}, expected {s.embedding_dimensions}.")
        print(f"Index {name} already exists (dimension {d.dimension}, metric {d.metric}) - nothing to do.")
        return
    pc.create_index(name=name, dimension=s.embedding_dimensions, metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"), deletion_protection="disabled")
    d = pc.describe_index(name)
    print(f"Created index {name}: dimension={d.dimension} metric={d.metric} ready={d.status.ready}")


if __name__ == "__main__":
    main()
