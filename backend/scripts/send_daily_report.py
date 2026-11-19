"""Sends the daily report once, to the address you give (never the Founder unless you type his address).

  python scripts/send_daily_report.py --to you@jhsassociates.in              # yesterday's report
  python scripts/send_daily_report.py --to you@jhsassociates.in --day 2026-11-18
Reads from the database in backend/.env (read only) and sends through the email settings in the same file.
"""
import argparse
import asyncio
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.controllers import daily_report as dr  # noqa: E402
from app.database.connection import close_mongo_connection, connect_to_mongo  # noqa: E402


async def main():
    p = argparse.ArgumentParser()
    p.add_argument("--to", required=True)
    p.add_argument("--day")
    a = p.parse_args()
    day = date.fromisoformat(a.day) if a.day else dr.yesterday_ist()
    await connect_to_mongo()
    try:
        print(await dr.send_report(day, a.to))
    finally:
        await close_mongo_connection()


asyncio.run(main())
