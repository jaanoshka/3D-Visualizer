from app import db


#import tables or wirte tables in code
class Model(db.Model):
    __tablename__ = 'models'

    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(80))
    depth_unit = db.Column(db.String(80))
    input_data_size = db.Column(db.Integer)
    batch_size = db.Column(db.Integer)
    learning_rate = db.Column(db.Integer) 


    def json(self):
        return {'id': self.id, 'model_name': self.model_name, 'depth_unit': self.depth_unit, 'input_data_size': self.input_data_size}