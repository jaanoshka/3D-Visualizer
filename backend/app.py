from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ
import sys

print(sys.executable)

# instance of flask app
app = Flask(__name__, static_folder='static')

# instance of sql alchemy db
db = SQLAlchemy()
cors = CORS()

# connection with db
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@flask_db:5432/postgres'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Set to 50 MB, adjust as needed

# initializing db
cors.init_app(
    app,
    resources= {r"*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}},
    supports_credentials= True
)
db.init_app(app)

# import tables
from tables.user_class import *
from tables.pointcloud_class import *
from tables.image_class import *
from tables.model_class import *

# create tables if import
with app.app_context():
    db.create_all()

# connect frontend
#CORS(app, resources={r"/":{'origins':""}})

from blueprints.user_blueprint import user_bp
from blueprints.image_blueprint import image_bp
from blueprints.pointcloud_blueprint import pointcloud_bp
from blueprints.model_blueprint import model_bp

app.register_blueprint(user_bp)
app.register_blueprint(image_bp)
app.register_blueprint(pointcloud_bp)
app.register_blueprint(model_bp)

# create a test route
@app.route('/test', methods=['GET'])
def test():
    return make_response(jsonify({'funktioniert!'}), 200)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
 