from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.String(32), primary_key=True,
                   unique=True, default=get_uuid)
    user_id = db.Column(db.String(18))
    task = db.Column(db.Text, nullable=False)
