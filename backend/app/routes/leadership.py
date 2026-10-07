from io import BytesIO
from typing import List, Optional

from bson.errors import InvalidId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from pydantic import EmailStr, TypeAdapter, ValidationError

from app.auth.deps import require_roles
from app.controllers import catalog as catalog_ctrl
from app.controllers import leadership as ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.leadership import (
    CITIES, LeadershipResponse, ROLES, SECTORS, SERVICES, STATUSES,
)
from app.utils.http import content_disposition

router = APIRouter(prefix="/leadership", tags=["Leadership"])

content_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.ADMIN])
_email = TypeAdapter(EmailStr)


def _only_allowed(label: str, values: List[str], allowed: List[str], required: bool = False) -> List[str]:
    cleaned = list(dict.fromkeys(v.strip() for v in values if v and v.strip()))
    bad = [v for v in cleaned if v not in allowed]
    if bad:
        raise HTTPException(status_code=422, detail=f"Invalid {label}: {', '.join(bad)}")
    if required and not cleaned:
        raise HTTPException(status_code=422, detail=f"At least one {label} is required")
    return cleaned


def _clean_email(value: Optional[str]) -> Optional[str]:
    value = (value or "").strip()
    if not value:
        return None
    try:
        return str(_email.validate_python(value))
    except ValidationError:
        raise HTTPException(status_code=422, detail="Invalid email address")


async def _catalog():
    """Allowed service / sector names and sub-service ids, from the admin-managed catalog
    (falls back to the built-in lists until the catalog has been seeded)."""
    services = await catalog_ctrl.list_services()
    sectors = await catalog_ctrl.list_sectors()
    allowed_services = [s["name"] for s in services] or SERVICES
    allowed_sectors = [s["name"] for s in sectors] or SECTORS
    valid_points, point_service = [], {}
    for svc in services:
        for p in svc["points"]:
            ref = f"{svc['key']}:{p['id']}"
            valid_points.append(ref)
            point_service[ref] = svc["name"]
    return allowed_services, allowed_sectors, valid_points, point_service


def _services_with_points(services: List[str], service_points: List[str], point_service: dict) -> List[str]:
    """A person listed under a sub-service is also listed under its service."""
    out = list(services)
    for ref in service_points:
        name = point_service.get(ref)
        if name and name not in out:
            out.append(name)
    return out


def _build(name, education, description, location, email, linkedin, services, sectors,
           specializations, roles, section, member_status, display_order, cities,
           service_points, allowed_services, allowed_sectors, valid_points, point_service) -> dict:
    name = name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Name is required")
    if member_status not in STATUSES:
        raise HTTPException(status_code=422, detail="Invalid status")
    return {
        "name": name,
        "education": education.strip(),
        "description": description.strip(),
        "location": location.strip(),
        "email": _clean_email(email),
        "linkedin": (linkedin or "").strip() or None,
        "services": _services_with_points(_only_allowed("service", services, allowed_services), service_points, point_service),
        "sectors": _only_allowed("sector", sectors, allowed_sectors),
        "service_points": _only_allowed("sub-service", service_points, valid_points),
        "cities": _only_allowed("city", cities, CITIES),
        "specializations": [s.strip() for s in specializations if s and s.strip()],
        "roles": _only_allowed("role", roles, ROLES, required=True),
        "section": (section or "").strip() or None,
        "status": member_status,
        "display_order": display_order,
    }


# ── Static paths first ───────────────────────────────────────────────────────

@router.get("/options")
async def options():
    return {"roles": ROLES, "services": SERVICES, "sectors": SECTORS, "cities": CITIES, "statuses": STATUSES}


@router.get("/hidden", response_model=List[str])
async def list_hidden():
    """Names of people switched to Inactive — lets hand-picked lists (service popups) hide them too."""
    return [m["name"] for m in await ctrl.list_members(include_inactive=True) if m.get("status") != "Active"]


@router.get("/admin/all", response_model=List[LeadershipResponse])
async def list_all(_: AdminInDB = Depends(content_access)):
    """Every person, including Inactive ones — for the admin panel."""
    return await ctrl.list_members(include_inactive=True)


@router.get("/photo/{photo_id}")
async def photo(photo_id: str):
    try:
        content, filename, content_type = await ctrl.get_photo(photo_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Photo not found")
    return StreamingResponse(
        BytesIO(content),
        media_type=content_type,
        headers={"Content-Disposition": content_disposition(filename),
                 "Cache-Control": "public, max-age=86400"},
    )


@router.get("/", response_model=List[LeadershipResponse])
async def list_public():
    """Active people only, ordered by display_order — feeds the Leadership page."""
    return await ctrl.list_members()


@router.post("/", response_model=LeadershipResponse, status_code=status.HTTP_201_CREATED)
async def create(
    name: str = Form(...),
    education: str = Form(""),
    description: str = Form(""),
    location: str = Form(""),
    email: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    services: List[str] = Form([]),
    sectors: List[str] = Form([]),
    cities: List[str] = Form([]),
    service_points: List[str] = Form([]),
    specializations: List[str] = Form([]),
    roles: List[str] = Form([]),
    section: Optional[str] = Form(None),
    member_status: str = Form("Active", alias="status"),
    display_order: int = Form(0),
    photo: Optional[UploadFile] = File(None),
    _: AdminInDB = Depends(content_access),
):
    allowed_services, allowed_sectors, valid_points, point_service = await _catalog()
    data = _build(name, education, description, location, email, linkedin, services,
                  sectors, specializations, roles, section, member_status, display_order, cities,
                  service_points, allowed_services, allowed_sectors, valid_points, point_service)
    if photo and photo.filename:
        data["photo_id"] = await ctrl.upload_photo(await photo.read(), photo.filename, photo.content_type)
    return await ctrl.create_member(data)


@router.put("/{member_id}", response_model=LeadershipResponse)
async def update(
    member_id: str,
    name: str = Form(...),
    education: str = Form(""),
    description: str = Form(""),
    location: str = Form(""),
    email: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    services: List[str] = Form([]),
    sectors: List[str] = Form([]),
    cities: List[str] = Form([]),
    service_points: List[str] = Form([]),
    specializations: List[str] = Form([]),
    roles: List[str] = Form([]),
    section: Optional[str] = Form(None),
    member_status: str = Form("Active", alias="status"),
    display_order: int = Form(0),
    remove_photo: bool = Form(False),
    photo: Optional[UploadFile] = File(None),
    _: AdminInDB = Depends(content_access),
):
    try:
        existing = await ctrl.get_member(member_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Person not found")
    if not existing:
        raise HTTPException(status_code=404, detail="Person not found")

    allowed_services, allowed_sectors, valid_points, point_service = await _catalog()
    data = _build(name, education, description, location, email, linkedin, services,
                  sectors, specializations, roles, section, member_status, display_order, cities,
                  service_points, allowed_services, allowed_sectors, valid_points, point_service)

    if photo and photo.filename:
        data["photo_id"] = await ctrl.upload_photo(await photo.read(), photo.filename, photo.content_type)
        data["photo_file"] = None
    elif remove_photo:
        data["photo_id"] = None
        data["photo_file"] = None
    if "photo_id" in data and existing.get("photo_id"):
        await ctrl.delete_photo(existing["photo_id"])

    return await ctrl.update_member(member_id, data)


@router.delete("/{member_id}")
async def remove(member_id: str, _: AdminInDB = Depends(content_access)):
    try:
        deleted = await ctrl.delete_member(member_id)
    except InvalidId:
        deleted = False
    if not deleted:
        raise HTTPException(status_code=404, detail="Person not found")
    return {"message": "Person deleted successfully"}
