from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SpaceBase(BaseModel):
    name: str
    description: Optional[str] = None

class SpaceCreate(SpaceBase):
    pass

class SpaceResponse(SpaceBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True 