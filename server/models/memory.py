from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    file_name = Column(String)
    image_description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    space_id = Column(Integer, ForeignKey("spaces.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    space = relationship("Space", back_populates="memories")
    user = relationship("User", back_populates="memories") 