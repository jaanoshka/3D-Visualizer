from app import db


#import tables or wirte tables in code
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username= db.Column(db.String(80), unique=True, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    
    def json(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}