from fastapi import HTTPException
from .authors import attach_authors
from typing import Optional, List 
from schemas import BookRead, newBook, UpdateBook, BookEdit
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, selectinload
from models import Book, Author, Category


    

def AddBooks(book: newBook, db: Session) ->BookRead:
    # validate category
    cat = db.query(Category).filter(Category.category_id == book.category_id).first()
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid category_id")
    
    #Ensure ISBN is unique
    exists = db.query(Book).filter(Book.isbn == book.isbn).first()
    if exists:
      raise HTTPException(status_code=400, detail="ISBN already exists")


    db_book = Book(
        title=book.title,
        isbn=book.isbn,
        description=book.description,
        published_date=book.published_date,
        category_id=book.category_id,
        is_deleted=False,
    )
    try:
        db.add(db_book)
        db.flush()  # assigns book_id
        if book.authors:
            attach_authors(db, db_book, book.authors)
        db.commit()
        
    except Exception as e:
      db.rollback()
      raise HTTPException(status_code=500, detail=str(e))
        

    # reload with relationships for response
    db_book = (
        db.query(Book)
          .options(selectinload(Book.category), selectinload(Book.authors))
          .filter(Book.book_id == db_book.book_id)
          .first()
    )
    return db_book


def DisplayBooks(book_id: int, db: Session ) ->BookEdit:
    
    fetchedBooks = (
        db.query(Book).options(selectinload(Book.category), selectinload(Book.authors))
        .filter(Book.book_id == book_id, Book.is_deleted == False)  # <-- only non-deleted
        .first()
    )
    if fetchedBooks is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return fetchedBooks



def DisplayAllBooks(db: Session) -> List[BookRead]:
    books = db.query(Book).options(selectinload(Book.category), selectinload(Book.authors)).filter(Book.is_deleted == False).all()  # <-- only non-deleted
    return books





def UpdateBooks(book_id: int, book: UpdateBook, db: Session ) ->BookEdit:
    db_book = (
        db.query(Book)
        .filter(Book.book_id == book_id, Book.is_deleted == False) 
        .first()
    )
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    
    if book.title is not None:
        db_book.title = book.title
    
    if book.authors is not None:    
        attach_authors(db, db_book, book.authors)
    if book.isbn is not None:
        db_book.isbn = book.isbn
    if book.description is not None:
        db_book.description = book.description
    if book.published_date is not None:
        db_book.published_date = book.published_date
    if book.category_id is not None:
        db_book.category_id = book.category_id        
    


    db.commit()
    db.refresh(db_book)
    return db_book



def DeleteBooks(book_id: int, db: Session ):
    db_book = db.query(Book).filter(Book.book_id == book_id, Book.is_deleted == False).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found or already deleted")

    db_book.is_deleted = True  
    db.commit()
    return {"detail": "Book soft-deleted successfully"}

def searchBooks( query: str, db: Session) ->List[BookRead] :
    
   
    q = query.strip().lower()
    
    db_book = db.query(Book).join(Book.authors).options(selectinload(Book.authors)).filter(or_(func.lower(Book.title).ilike(f"%{q}%"), func.lower(Author.name).ilike(f"%{q}%")) ,Book.is_deleted == False).distinct(Book.book_id).all()
     

    return db_book

def filterBooks(  category_ids: List[int], db: Session )->List[BookRead]:
      
   
   category = db.query(Category).filter(Category.category_id.in_(category_ids)).all()
   if not category:
       raise HTTPException(status_code=404, detail="Category not found")
   
   books = db.query( Book).filter(Book.category_id.in_(category_ids), Book.is_deleted== False).all()
   


   
   
   return books

