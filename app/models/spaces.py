from app.db.database import Base
from app.models.user import User
from sqlalchemy import Column, String, ForeignKey, Integer, LargeBinary, TIMESTAMP, text
from sqlalchemy.orm import relationship

class Spaces(Base):
    __tablename__ = "spaces"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)  # Primary key for Upload table
    user_id = Column(String, ForeignKey("User.id"), nullable=False)  # Foreign key referencing User.id
    space_name = Column(String, nullable=False)
    # Define the relationship with the User table
    user = relationship("User", back_populates="spaces")