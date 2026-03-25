"""Full Human Design chart calculation: type, authority, profile, centers, channels."""

from collections import defaultdict
from datetime import datetime

from app.core.constants import (
    ALL_CENTERS,
    AUTHORITY_PRIORITY,
    CENTER_GATES,
    CHANNEL_CENTERS,
    CHANNELS,
    MOTOR_CENTERS,
    PLANET_NAMES,
    STRATEGY,
)
from app.core.ephemeris import find_design_date, get_planetary_positions
from app.core.gates import longitude_to_gate_line


def _find_active_channels(active_gates: set[int]) -> list[tuple[int, int]]:
    """Return channels where both gates are active."""
    return [(g1, g2) for g1, g2 in CHANNELS if g1 in active_gates and g2 in active_gates]


def _find_defined_centers(active_channels: list[tuple[int, int]]) -> set[str]:
    """Centers are defined when they sit at the end of an active channel."""
    defined = set()
    for channel in active_channels:
        c1, c2 = CHANNEL_CENTERS[channel]
        defined.add(c1)
        defined.add(c2)
    return defined


def _has_motor_to_throat_path(defined_centers: set[str], active_channels: list[tuple[int, int]]) -> bool:
    """
    Check if any motor center connects to the Throat through defined channels.
    Uses BFS on the center connectivity graph built from active channels.
    """
    if "Throat" not in defined_centers:
        return False

    # Build adjacency graph of defined centers
    adj: dict[str, set[str]] = defaultdict(set)
    for channel in active_channels:
        c1, c2 = CHANNEL_CENTERS[channel]
        adj[c1].add(c2)
        adj[c2].add(c1)

    # BFS from Throat to find reachable motor centers
    visited = {"Throat"}
    queue = ["Throat"]
    while queue:
        current = queue.pop(0)
        for neighbor in adj[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return bool(visited & MOTOR_CENTERS)


def _determine_type(defined_centers: set[str], active_channels: list[tuple[int, int]]) -> str:
    """Determine the Human Design Type."""
    if not defined_centers:
        return "Reflector"

    sacral_defined = "Sacral" in defined_centers
    motor_to_throat = _has_motor_to_throat_path(defined_centers, active_channels)

    if sacral_defined and motor_to_throat:
        return "Manifesting Generator"
    if sacral_defined:
        return "Generator"
    if motor_to_throat:
        return "Manifestor"
    return "Projector"


def _determine_authority(defined_centers: set[str], hd_type: str) -> str:
    """Determine the inner authority based on defined centers."""
    if hd_type == "Reflector":
        return "Lunar Authority"

    for center, authority in AUTHORITY_PRIORITY:
        if center in defined_centers:
            return authority

    return "Environment/Mental Authority"


def calculate_chart(dob: str, time: str, lat: float, lng: float) -> dict:
    """
    Calculate a complete Human Design chart.

    Args:
        dob: Birth date as YYYY-MM-DD
        time: Birth time as HH:MM
        lat: Latitude
        lng: Longitude

    Returns:
        Complete chart data dict.
    """
    # Parse birth datetime
    birth_dt = datetime.strptime(f"{dob} {time}", "%Y-%m-%d %H:%M")

    # Get personality (birth) planetary positions
    personality_positions = get_planetary_positions(birth_dt)

    # Find design date and get design planetary positions
    design_dt = find_design_date(birth_dt)
    design_positions = get_planetary_positions(design_dt)

    # Convert longitudes to gate/line for each planet
    personality_activations = []
    design_activations = []
    all_active_gates: set[int] = set()

    for planet in PLANET_NAMES:
        lon = personality_positions[planet]
        gate, line = longitude_to_gate_line(lon)
        personality_activations.append({
            "planet": planet,
            "gate": gate,
            "line": line,
            "longitude": round(lon, 4),
        })
        all_active_gates.add(gate)

    for planet in PLANET_NAMES:
        lon = design_positions[planet]
        gate, line = longitude_to_gate_line(lon)
        design_activations.append({
            "planet": planet,
            "gate": gate,
            "line": line,
            "longitude": round(lon, 4),
        })
        all_active_gates.add(gate)

    # Determine channels, centers, type, authority, profile
    active_channels = _find_active_channels(all_active_gates)
    defined_centers = _find_defined_centers(active_channels)
    undefined_centers = set(ALL_CENTERS) - defined_centers

    hd_type = _determine_type(defined_centers, active_channels)
    authority = _determine_authority(defined_centers, hd_type)
    strategy = STRATEGY[hd_type]

    # Profile: Personality Sun line / Design Sun line
    p_sun_line = personality_activations[0]["line"]  # Sun is first
    d_sun_line = design_activations[0]["line"]
    profile = f"{p_sun_line}/{d_sun_line}"

    return {
        "type": hd_type,
        "profile": profile,
        "strategy": strategy,
        "authority": authority,
        "defined_centers": sorted(defined_centers),
        "undefined_centers": sorted(undefined_centers),
        "active_channels": [list(ch) for ch in active_channels],
        "personality_planets": personality_activations,
        "design_planets": design_activations,
        "active_gates": sorted(all_active_gates),
    }
