from fastapi import Depends, APIRouter, Request

from typing import  List 
from schemas import CategoryCreate, CategoryRead
from database import get_db

from sqlalchemy.orm import Session
from .limiter import limiter

from db.category import (add_category, display_all_category)


router = APIRouter(prefix="/categories")


@router.post("",  response_model=CategoryRead) #create/add operation: Does not require try/except handling
@limiter.limit("5/second")
def CreateCategory(request: Request, cat: CategoryCreate, db: Session = Depends(get_db)): 
    newCategory = add_category(cat, db)
    
    return newCategory



@router.get("/",  response_model=List[CategoryRead]) #display all books
@limiter.limit("5/second")
def FetchAllCategories(request: Request, db: Session = Depends(get_db)): 

    db_category = display_all_category(db)
   
    
    return db_category
