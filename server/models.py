from flask.ext.sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Board(db.Model):
    __tablename__ = 'boards'
    id = db.Column(db.Integer, primary_key=True)
    tiles = db.Column(db.String)
    difficulty = db.Column(db.Integer)
