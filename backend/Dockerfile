FROM python:3.11-slim

# Run as an unprivileged user so a bug in the app cannot take over the container.
RUN useradd --create-home --uid 10001 app

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=app:app . .
USER app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
