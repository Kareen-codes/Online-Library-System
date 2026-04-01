from database import SessionLocal, engine
from models import Base, Category

def seed_categories():
    db = SessionLocal()
    

    Base.metadata.create_all(bind=engine)

    categories = [
        {"category_id": 1, "name": "Technology"},
        {"category_id": 2, "name": "Marketing"},
        {"category_id": 3, "name": "Science"},
        {"category_id": 4, "name": "Media"},
        {"category_id": 5, "name": "Fiction"},
    ]

    for cat in categories:
        exists = db.query(Category).filter_by(category_id=cat["category_id"]).first()
        if not exists:
            db.add(Category(**cat))
    
    db.commit()
    db.close()


if __name__ == "__main__":
    seed_categories()
    print("✔ Categories seeded successfully!")
