"""Vercel serverless entry point — wraps the FastAPI app."""
import sys
import os

# Make the backend package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: F401  (Vercel looks for `app`)
