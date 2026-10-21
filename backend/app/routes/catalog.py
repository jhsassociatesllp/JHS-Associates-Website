from typing import List

from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.deps import require_roles
from app.controllers import catalog as ctrl
from app.schemas.admin import AdminInDB, AdminRole
from app.schemas.catalog import SectorIn, SectorOut, ServiceIn, ServiceOut

router = APIRouter(prefix="/catalog", tags=["Services & Sectors"])

content_access = require_roles([AdminRole.SUPER_ADMIN, AdminRole.ADMIN])


# ── Services (public read, admin write) ──────────────────────────────────────

@router.get("/services", response_model=List[ServiceOut])
async def list_services():
    return await ctrl.list_services()


@router.post("/services", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
async def create_service(data: ServiceIn, _: AdminInDB = Depends(content_access)):
    return await ctrl.create_service(data)


@router.put("/services/{key}", response_model=ServiceOut)
async def update_service(key: str, data: ServiceIn, _: AdminInDB = Depends(content_access)):
    updated = await ctrl.update_service(key, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Service not found")
    return updated


@router.delete("/services/{key}")
async def delete_service(key: str, _: AdminInDB = Depends(content_access)):
    if not await ctrl.delete_service(key):
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}


# ── Sectors ──────────────────────────────────────────────────────────────────

@router.get("/sectors", response_model=List[SectorOut])
async def list_sectors():
    return await ctrl.list_sectors()


@router.post("/sectors", response_model=SectorOut, status_code=status.HTTP_201_CREATED)
async def create_sector(data: SectorIn, _: AdminInDB = Depends(content_access)):
    created = await ctrl.create_sector(data)
    if not created:
        raise HTTPException(status_code=409, detail="A sector with this name already exists")
    return created


@router.put("/sectors/{sector_id}", response_model=SectorOut)
async def update_sector(sector_id: str, data: SectorIn, _: AdminInDB = Depends(content_access)):
    try:
        updated = await ctrl.update_sector(sector_id, data)
    except InvalidId:
        updated = None
    if not updated:
        raise HTTPException(status_code=404, detail="Sector not found")
    return updated


@router.delete("/sectors/{sector_id}")
async def delete_sector(sector_id: str, _: AdminInDB = Depends(content_access)):
    try:
        deleted = await ctrl.delete_sector(sector_id)
    except InvalidId:
        deleted = False
    if not deleted:
        raise HTTPException(status_code=404, detail="Sector not found")
    return {"message": "Sector deleted"}
