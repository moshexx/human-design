"""Geocode city names to lat/lng using Nominatim (OpenStreetMap)."""

import httpx
from fastapi import HTTPException

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS = {"User-Agent": "HumanDesignApp/1.0"}


async def geocode_city(city: str) -> tuple[float, float]:
    """Convert a city name to (latitude, longitude) coordinates."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            NOMINATIM_URL,
            params={"q": city, "format": "json", "limit": 1},
            headers=HEADERS,
            timeout=10.0,
        )
        resp.raise_for_status()
        results = resp.json()

    if not results:
        raise HTTPException(status_code=400, detail=f"City not found: {city}")

    return float(results[0]["lat"]), float(results[0]["lon"])
