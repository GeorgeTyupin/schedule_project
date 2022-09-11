import email
from . import DATA_DST
import sqlite3
import time
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import select
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

class Base(DeclarativeBase):
   pass

class User(Base):
   __tablename__ = "users"
   id: Mapped[int] = mapped_column(primary_key=True)
   name: Mapped[str] = mapped_column(String(30))
   password: Mapped[str] = mapped_column(String(30))
   email: Mapped[str] = mapped_column(String(30))

   def __repr__(self) -> str:
      return f"User(id={self.id!r}, name={self.name!r}, email={self.email!r})"

print(select(User).where(User.name == 'spongebob'))
