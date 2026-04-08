from fastapi import APIRouter, Depends, Request, Query

from typing import Optional, List 
from schemas import BookRead, newBook, UpdateBook, BookEdit
from database import get_db

from sqlalchemy.orm import Session
from .limiter import limiter
from db.books import (AddBooks,  DisplayBooks, DisplayAllBooks,  UpdateBooks, DeleteBooks, searchBooks, filterBooks)


router = APIRouter(prefix="/books")


@router.post("",  response_model=BookRead) #create/add operation: Does not require try/except handling
@limiter.limit("5/second")
def CreateBook(request: Request, book: newBook, db: Session = Depends(get_db)): 
    newBook = AddBooks(book, db)
    
    return newBook


@router.get("/search/by", response_model = List[BookRead] )
@limiter.limit("5/second")
def BookSearch(request: Request, query: str, db: Session = Depends(get_db)): 
    
    db_book =searchBooks(query, db)
  
    
    return db_book

@router.get("/filter/", response_model=List[BookRead])
@limiter.limit("5/second")
def FilterBook(request: Request, category_id: List[int] = Query(...), db: Session=Depends(get_db)):
    
    db_book = filterBooks(category_id, db)
    
    return db_book or []

@router.get("/",  response_model=List[BookRead]) #display all books
@limiter.limit("5/second")
def FetchAllBooks(request: Request, db: Session = Depends(get_db)): 
    
    db_book = DisplayAllBooks(db)
   
    
    return db_book


@router.get("/{book_id}",  response_model=BookEdit ) #display book by id
@limiter.limit("5/second")
def FetchBook(request: Request, book_id: int, db: Session = Depends(get_db)): 
    
    db_book =  DisplayBooks(book_id, db)
    
    return db_book

@router.put("/update/{book_id}",  response_model=BookEdit) #update book by id
@limiter.limit("5/second")
def BookUpdate(request: Request, book_id: int, book: UpdateBook, db: Session = Depends(get_db)): 
    
    db_book = UpdateBooks(book_id, book, db)
   
    
    return db_book
@router.delete("/delete/{book_id}") #soft delete book by id
@limiter.limit("5/second")
def BookDelete(request: Request, book_id: int, db: Session = Depends(get_db)): 
 
    db_book =DeleteBooks(book_id, db)
   
    
    return db_book


