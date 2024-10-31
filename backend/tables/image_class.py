from app import db


#import tables or wirte tables in code
class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    image_data = db.Column(db.LargeBinary)
    longitude = db.Column(db.Integer, unique=True)
    latitude = db.Column(db.Integer, unique=True)

    # Foreign key columns
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  

    def json(self):
        return {'id': self.id, 'image_data': self.image_data, 'northing': self.longitude, 'easting': self.latitude, 'user_id': self.user_id}