from app import db


#import tables or wirte tables in code
class Pointcloud(db.Model):
    __tablename__ = 'pointclouds'

    id = db.Column(db.Integer, primary_key=True)
    grid_data = db.Column(db.String(80), unique=True)
    resolution = db.Column(db.String(80))

    # Foreign key columns
    image_id = db.Column(db.Integer, db.ForeignKey('images.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  

    def json(self):
        return {'id': self.id, 'model_name': self.model_name, 'grid_data': self.grid_data, 'resolution': self.resolution, 'image_id': self.image_id, 'user_id': self.user_id}