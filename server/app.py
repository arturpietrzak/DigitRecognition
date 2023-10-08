import tensorflow as tf
import base64
from PIL import Image
import io
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import os

model = tf.keras.models.load_model('./model/digits_recognition')

def base64_to_array(base64_str):
    stripped = base64_str.split(',')[1]
    stripped = stripped.replace(" ", "+") # fix '+' being as a space
    image_bytes = base64.b64decode(stripped)
    image = Image.open(io.BytesIO(image_bytes))
    image_array = np.array(image)
    flattened_array = image_array[:,:,0]
    normalized_array = flattened_array / 255
    
    return normalized_array

def get_predicted_number(image_array):
    batch = np.array([image_array])
    prediction = model.predict(batch)
    
    return [np.argmax(prediction[0]), np.max(prediction[0])]

app = Flask(__name__, static_folder='frontend')
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/classify_number', methods=['POST'])
@cross_origin()
def echo():
    image_base64 = request.json.get('image')
    response = jsonify({'prediction': str(-1), 'probability': str(-1)})
    if (image_base64):
        image_array = base64_to_array(image_base64)
        result = get_predicted_number(image_array)
        response = jsonify({'prediction': str(result[0]), 'probability': str(result[1])})
    
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

