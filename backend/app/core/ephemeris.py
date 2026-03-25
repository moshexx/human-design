"""Swiss Ephemeris wrapper for planetary position calculations."""

from datetime import datetime

import swisseph as swe

# Map planet names to swisseph constants
_PLANET_IDS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mercury": swe.MERCURY,
    "Venus": swe.VENUS,
    "Mars": swe.MARS,
    "Jupiter": swe.JUPITER,
    "Saturn": swe.SATURN,
    "Uranus": swe.URANUS,
    "Neptune": swe.NEPTUNE,
    "Pluto": swe.PLUTO,
    "North Node": swe.MEAN_NODE,
}


def _datetime_to_jd(dt: datetime) -> float:
    """Convert a datetime to Julian Day number."""
    hour_decimal = dt.hour + dt.minute / 60.0 + dt.second / 3600.0
    return swe.julday(dt.year, dt.month, dt.day, hour_decimal)


def get_planetary_positions(dt: datetime) -> dict[str, float]:
    """
    Calculate ecliptic longitudes for all 13 HD planets at the given datetime.
    Returns dict of planet_name -> longitude (0-360°).
    """
    jd = _datetime_to_jd(dt)
    positions: dict[str, float] = {}

    for name, planet_id in _PLANET_IDS.items():
        result = swe.calc_ut(jd, planet_id)
        positions[name] = result[0][0]  # longitude

    # Earth is opposite the Sun
    positions["Earth"] = (positions["Sun"] + 180.0) % 360.0

    # South Node is opposite the North Node
    positions["South Node"] = (positions["North Node"] + 180.0) % 360.0

    return positions


def find_design_date(birth_dt: datetime) -> datetime:
    """
    Find the Design datetime: when the Sun was at (birth_sun_longitude - 88°).
    Uses Newton-Raphson iteration for sub-arcsecond precision.
    """
    birth_jd = _datetime_to_jd(birth_dt)

    # Get Sun position at birth
    birth_sun = swe.calc_ut(birth_jd, swe.SUN)
    birth_sun_lon = birth_sun[0][0]
    target_lon = (birth_sun_lon - 88.0) % 360.0

    # Initial estimate: ~88 days before birth (Sun moves ~1°/day)
    jd = birth_jd - 88.0

    for _ in range(20):  # Max iterations (usually converges in 2-4)
        result = swe.calc_ut(jd, swe.SUN)
        current_lon = result[0][0]
        sun_speed = result[0][3]  # degrees per day

        # Calculate difference, handling the 360° wrap-around
        diff = current_lon - target_lon
        if diff > 180.0:
            diff -= 360.0
        elif diff < -180.0:
            diff += 360.0

        if abs(diff) < 0.0001:  # Sub-arcsecond precision
            break

        jd -= diff / sun_speed

    # Convert Julian Day back to datetime
    year, month, day, hour_frac = swe.revjul(jd)
    hours = int(hour_frac)
    minutes = int((hour_frac - hours) * 60)
    seconds = int(((hour_frac - hours) * 60 - minutes) * 60)

    return datetime(year, month, day, hours, minutes, seconds)
