from app.db.database import Base
from app.models.user import User
from sqlalchemy import Column, String, ForeignKey, Integer, LargeBinary, TIMESTAMP, text
from sqlalchemy.orm import relationship

class Memory(Base):
    __tablename__ = "memory"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)  # Primary key for Upload table
    user_id = Column(String, ForeignKey("User.id"), nullable=False)  # Foreign key referencing User.id
    file_name = Column(String, nullable=False)
    # file_content = Column(LargeBinary, nullable=False)
    image_description = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    space_name = Column(String, nullable=False)
    # Define the relationship with the User table
    user = relationship("User", back_populates="memory")
