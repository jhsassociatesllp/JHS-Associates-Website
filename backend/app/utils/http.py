from urllib.parse import quote


def content_disposition(filename: str, disposition: str = "inline") -> str:
    """Build a spec-safe Content-Disposition header value.

    Filenames come straight from whatever the admin typed when uploading
    (video titles, report names, etc.) and routinely contain commas,
    parentheses, '#' or non-ASCII characters. An unquoted
    `filename={filename}` breaks on any of those — a comma in particular
    gets read as a second header value, which is what produces the
    "multiple Content-Disposition" browser error. RFC 6266 fixes this with
    a quoted ASCII fallback plus a percent-encoded UTF-8 variant.
    """
    ascii_fallback = (
        filename.encode("ascii", "ignore").decode("ascii")
        .replace("\\", "")
        .replace('"', "")
        .strip()
    ) or "file"
    encoded = quote(filename, safe="")
    return f"{disposition}; filename=\"{ascii_fallback}\"; filename*=UTF-8''{encoded}"
