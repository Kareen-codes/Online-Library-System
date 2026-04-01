from fastapi import HTTPException

from typing import  List 
from schemas import CategoryCreate, CategoryRead


from sqlalchemy.orm import Session
from models import  Category



def add_category(cat: CategoryCreate, db: Session)-> CategoryRead:
    exists = db.query(Category).filter(Category.name == cat.name).first()
    if exists:
        raise HTTPException(status_code=400, detail="Category name already exists")

    new_cat = Category(name=cat.name, description=cat.description)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat



def display_all_category( db: Session) -> List[CategoryRead]:
    category = db.query(Category).all()
    
    return category