from sqlalchemy import (
      Column, Integer, String, Date, Text, ForeignKey, Table, Boolean
)
from sqlalchemy.orm import relationship, DeclarativeBase




class Base(DeclarativeBase):
    pass


book_authors = Table(
    "book_authors",
    Base.metadata,
    Column("book_id", ForeignKey("books.book_id", ondelete="CASCADE"), primary_key=True),
    Column("author_id", ForeignKey("authors.author_id", ondelete="CASCADE"), primary_key=True),
)


class Book(Base):
    __tablename__ = "books"

    book_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), index=True, nullable=False)

  
    isbn = Column(String(255), index=True, unique=True, nullable=False)

    description = Column(Text, nullable=True)               
    published_date = Column(Date, nullable=True)
    is_deleted = Column(Boolean, nullable=False, default=False, index=True)  

    # Proper foreign key to categories.category_id
    category_id = Column(
        Integer,
        ForeignKey("categories.category_id", ondelete="SET NULL"),
        index=True,
        nullable=True
    )
    
    

    # Relationships           #Class          #refrences/points back to 'books' table
    category = relationship("Category", backref="books", lazy="selectin")
    

    authors = relationship(
        "Author",
        secondary=book_authors,
        back_populates="books",
        lazy="selectin"
    )


class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True) 


class Author(Base):
    __tablename__ = "authors"

    author_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), index=True, nullable=False)
 
    bio = Column(Text, nullable=True)

    books = relationship(
        "Book",
        secondary=book_authors,
        back_populates="authors",
        lazy="selectin"
    )
    
