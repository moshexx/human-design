"""Pydantic request/response schemas."""

import re
from typing import Literal
from pydantic import BaseModel, EmailStr, field_validator


class ChartRequest(BaseModel):
    name: str
    email: EmailStr
    dob: str  # YYYY-MM-DD
    time: str  # HH:MM
    city: str
    goal: Literal["career", "love", "growth", "all"] | None = None
    experience: Literal["beginner", "heard", "studying"] | None = None

    @field_validator("dob")
    @classmethod
    def validate_dob(cls, v: str) -> str:
        if not re.match(r"^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$", v):
            raise ValueError("dob must be in YYYY-MM-DD format with valid month and day")
        return v

    @field_validator("time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        if not re.match(r"^([01]\d|2[0-3]):[0-5]\d$", v):
            raise ValueError("time must be in HH:MM format (00:00–23:59)")
        return v

    @field_validator("city")
    @classmethod
    def validate_city(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("city must be at least 2 characters")
        return v.strip()


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
