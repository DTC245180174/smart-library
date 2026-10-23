import uvicorn
import os
import sys

if __name__ == "__main__":
    # Ensure current directory is in path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    print("====================================================")
    print("🚀 SmartLib Python Backend dang khoi dong tren port 8000...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("====================================================")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)