from sqlalchemy.orm import Session
from models import Book, Author


def attach_authors(db: Session, db_book: Book, names: list[str]) -> None:
    
    if names is None:
        return
    
    db_book.authors.clear()

    for full_name in names:
        clean_name = full_name.strip()
        if not clean_name:
            continue

    
        author = (
            db.query(Author)
              .filter(Author.name.ilike(clean_name))
              .first()
        )

     
        if author is None:
            author = Author(
                name=clean_name,
                bio= ""  
            )
            db.add(author)
            db.flush()  

 
        db_book.authors.append(author)  
        
        
    #Other Author methods go here