import sys
import os

# Add root directory to python path for Linux container compatibility
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from backend.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Uvicorn Server on 0.0.0.0:{port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
