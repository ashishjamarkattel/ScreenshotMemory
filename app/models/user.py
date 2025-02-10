from app.db.database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, text
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "User"

    id = Column(String,primary_key=True,nullable=False)
    email = Column(String,nullable=False)
    first_name = Column(String,nullable=False)
    last_name = Column(String,nullable=False)

    # Define the relationship with the Spaces table
    spaces = relationship("Spaces", back_populates="user")
    memory = relationship("Memory", back_populates="user")
