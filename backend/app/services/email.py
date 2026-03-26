"""Send chart summary emails via Resend."""

import os
import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Human Design <noreply@resend.dev>")

TYPE_HE = {
    "Generator": "גנרטור",
    "Manifesting Generator": "גנרטור מניפסטציה",
    "Projector": "פרוג'קטור",
    "Manifestor": "מניפסטור",
    "Reflector": "רפלקטור",
}

STRATEGY_HE = {
    "Generator": "המתן להיענות",
    "Manifesting Generator": "הגיב, ואז ידע",
    "Projector": "המתן להזמנה",
    "Manifestor": "ידע, ואז יזום",
    "Reflector": "המתן מחזור ירח",
}


def _build_html(name: str, chart: dict) -> str:
    hd_type = chart.get("type", "")
    type_he = TYPE_HE.get(hd_type, hd_type)
    profile = chart.get("profile", "")
    authority = chart.get("authority", "")
    strategy = STRATEGY_HE.get(hd_type, chart.get("strategy", ""))
    defined = ", ".join(chart.get("defined_centers", []))
    undefined = ", ".join(chart.get("undefined_centers", []))
    channels = chart.get("active_channels", [])
    channels_str = " | ".join(f"{g1}–{g2}" for g1, g2 in channels[:6])
    if len(channels) > 6:
        channels_str += f" +{len(channels) - 6} נוספים"

    return f"""
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>העיצוב האנושי של {name}</title>
</head>
<body style="margin:0;padding:0;background:#0D0B1A;font-family:'Helvetica Neue',Arial,sans-serif;direction:rtl;color:#F8F7FF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0B1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="color:rgba(139,92,246,0.8);font-size:13px;font-weight:600;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;">
                ✦ עיצוב אנושי
              </div>
              <h1 style="margin:0;font-size:32px;font-weight:800;background:linear-gradient(135deg,#8B5CF6,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                העיצוב האנושי של {name}
              </h1>
              <p style="color:#9CA3AF;margin:8px 0 0;font-size:15px;">הנה סיכום הקריאה שלך</p>
            </td>
          </tr>

          <!-- Type Hero -->
          <tr>
            <td style="background:rgba(26,23,48,0.9);border:1px solid rgba(139,92,246,0.25);border-radius:16px;padding:32px;text-align:center;margin-bottom:16px;">
              <div style="font-size:48px;font-weight:800;color:#8B5CF6;margin-bottom:8px;">{type_he}</div>
              <div style="font-size:18px;color:rgba(248,247,255,0.6);margin-bottom:16px;">פרופיל {profile}</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:8px;">
                    <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:10px;padding:14px;">
                      <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">אסטרטגיה</div>
                      <div style="color:#F8F7FF;font-size:14px;font-weight:600;">🧭 {strategy}</div>
                    </div>
                  </td>
                  <td width="50%" style="padding:8px;">
                    <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:10px;padding:14px;">
                      <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">סמכות</div>
                      <div style="color:#F8F7FF;font-size:14px;font-weight:600;">⚡ {authority}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:12px;"></td></tr>

          <!-- Centers -->
          <tr>
            <td style="background:rgba(26,23,48,0.9);border:1px solid rgba(139,92,246,0.25);border-radius:16px;padding:24px;">
              <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">מרכזים מוגדרים</div>
              <div style="color:#c4b5fd;font-size:14px;font-weight:600;margin-bottom:20px;">{defined or "אין"}</div>
              <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">מרכזים פתוחים</div>
              <div style="color:#9CA3AF;font-size:14px;margin-bottom:20px;">{undefined or "אין"}</div>
              {"<div style='color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;'>ערוצים פעילים</div><div style='color:#c4b5fd;font-size:13px;font-family:monospace;'>" + channels_str + "</div>" if channels else ""}
            </td>
          </tr>

          <tr><td style="height:12px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1));border:1px solid rgba(139,92,246,0.3);border-radius:16px;padding:32px;text-align:center;">
              <div style="color:rgba(139,92,246,0.8);font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">✦ רוצה להעמיק?</div>
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#F8F7FF;">קריאה מלאה ומותאמת אישית</h2>
              <p style="color:#9CA3AF;font-size:14px;margin:0 0 24px;line-height:1.6;">
                ניתוח מעמיק של כל השערים שלך, צלב ההתגלמות, הפעלות כוכביות והנחיה אישית לחיים בהתאם לעיצוב שלך.
              </p>
              <a href="mailto:contact@yourdomain.com?subject=קריאה מלאה - {name}"
                 style="display:inline-block;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:700;">
                צור קשר לקריאה מלאה ←
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:rgba(156,163,175,0.5);font-size:12px;margin:0;">
                קיבלת מייל זה כי ביקשת קריאת עיצוב אנושי · 100% פרטי
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


async def send_chart_email(to_email: str, name: str, chart: dict) -> None:
    """Send chart summary email to the user via Resend."""
    if not RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY is not set")

    resend.api_key = RESEND_API_KEY

    resend.Emails.send({
        "from": EMAIL_FROM,
        "to": [to_email],
        "subject": f"העיצוב האנושי של {name} — הקריאה שלך מוכנה",
        "html": _build_html(name, chart),
    })
