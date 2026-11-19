"""Structured (JSON) logging with PII redaction. Never log secrets, full prompts or document bodies."""
import json
import logging
import re
import sys
from datetime import datetime, timezone

_EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
_PHONE = re.compile(r"(?<!\d)(?:\+?\d[\s-]?){9,13}(?!\d)")
_KEY = re.compile(r"\b(sk-[A-Za-z0-9_-]{8,}|pcsk_[A-Za-z0-9_-]{8,}|pk-lf-[A-Za-z0-9-]+|sk-lf-[A-Za-z0-9-]+)\b")


def redact(text: str) -> str:
    text = _KEY.sub("[secret]", text or "")
    text = _EMAIL.sub("[email]", text)
    return _PHONE.sub("[phone]", text)


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": redact(record.getMessage()),
        }
        extra = getattr(record, "ctx", None)
        if isinstance(extra, dict):
            payload.update({k: v for k, v in extra.items()})
        if record.exc_info:
            payload["exc"] = redact(self.formatException(record.exc_info))
        return json.dumps(payload, default=str)


def setup_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(level.upper())
    for noisy in ("httpx", "httpcore", "pymongo", "urllib3"):
        logging.getLogger(noisy).setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
