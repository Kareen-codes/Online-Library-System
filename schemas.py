from __future__ import annotations
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from datetime import date



class AuthorNameOnly(BaseModel):
    model_config = ConfigDict(from_attributes=True) #Allows Pydantic to read attributes from an ORM object
    name: str


class CategoryNameOnly(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str



class CategoryCreate(BaseModel):
    
    name: str
    description: Optional[str] = None
    
class CategoryRead(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    category_id: int
    name: str
    description: Optional[str] = None

class newBook(BaseModel):
    title: str
  
    authors: List[str] = Field(default_factory=list)  
  
    isbn: str
    description: Optional[str] = None
    published_date: Optional[date] = None
    category_id: int

class UpdateBook(BaseModel):
   
    title: Optional[str] = None
    authors: Optional[List[str]] = None 
              
    isbn: Optional[str] = None
    description: Optional[str] = None
    published_date: Optional[date] = None
    category_id: Optional[int] = None


class BookRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    book_id: int
    title: str
    authors: List[AuthorNameOnly] = Field(default_factory=list)  
    description: Optional[str] = None    
    category: Optional[CategoryNameOnly] = None


    
#Make Author Independent
class AuthorCreate(BaseModel):
    
    name: str
    bio: str
    
class AuthorRead(BaseModel):   
    model_config = ConfigDict(from_attributes=True)
    author_id: int
    name: str
    bio: str
    
class AuthorUpdate(BaseModel):   
    name: Optional[str] = None
    bio: Optional[str] =None
    
