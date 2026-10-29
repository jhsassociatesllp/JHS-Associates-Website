"""Exact submission time, written in plain words next to the machine timestamp.

Every form already stores `created_at` (UTC, to the millisecond). `submitted_at_ist` stores the same moment in
Indian Standard Time as readable text, so anyone opening the database in Compass sees the real date and time
without converting, for example "29-10-2026 03:42:17 PM IST".
"""
from datetime import datetime, timedelta, timezone

IST = timezone(timedelta(hours=5, minutes=30))


def submitted_at_ist(moment: datetime | None = None) -> str:
    moment = moment or datetime.now(timezone.utc)
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.astimezone(IST).strftime("%d-%m-%Y %I:%M:%S %p IST")
