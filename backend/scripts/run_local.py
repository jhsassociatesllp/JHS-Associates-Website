"""Starts the backend on port 8001 against the LOCAL test database (Docker, port 27018) instead of the real one.

Run (from the backend folder):   python scripts/run_local.py
First time only:                 docker run -d --name jhs-local-mongo -p 27018:27017 mongo:7
                                 python scripts/seed_local_test.py
"""
import os
import sys

os.environ["MONGODB_URL"] = os.environ.get("LOCAL_MONGODB_URL", "mongodb://localhost:27018/")
os.environ["DATABASE_NAME"] = os.environ.get("LOCAL_DATABASE_NAME", "JHS_local_test")
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn  # noqa: E402

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001)
