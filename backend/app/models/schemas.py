"""Pydantic request/response schemas."""

from pydantic import BaseModel, EmailStr


class ChartRequest(BaseModel):
    name: str
    email: EmailStr
    dob: str  # YYYY-MM-DD
    time: str  # HH:MM
    city: str
    goal: str | None = None        # "career" | "love" | "growth" | "all"
    experience: str | None = None  # "beginner" | "heard" | "studying"


class PlanetaryActivation(BaseModel):
    planet: str
    gate: int
    line: int
    longitude: float


class ChartResponse(BaseModel):
    name: str
    type: str
    profile: str
    strategy: str
    authority: str
    defined_centers: list[str]
    undefined_centers: list[str]
    active_channels: list[list[int]]
    personality_planets: list[PlanetaryActivation]
    design_planets: list[PlanetaryActivation]
    active_gates: list[int]
