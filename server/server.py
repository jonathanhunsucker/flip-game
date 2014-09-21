from flask import Flask
from flask.ext.sandboy import Sandboy

from models import Board, db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/flip'
db.init_app(app)
with app.app_context():
    db.create_all()
    sandboy = Sandboy(app, db, [Board])
    app.run(debug=True)
