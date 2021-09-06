import pytesseract
import cv2
import matplotlib.pyplot as plt
from flask import Flask, render_template, jsonify, request, redirect, url_for
import matplotlib.pyplot as plt
from PIL import Image
from werkzeug.wrappers import response
from flask_cors import CORS, cross_origin


pytesseract.pytesseract.tesseract_cmd = "C:/Program Files/Tesseract-OCR/tesseract.exe"
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
@cross_origin()
def index():
    print("gettign to uploadhtml")
    return render_template("upload.html")

@app.route('/buttonpress',methods=['POST'])
@cross_origin()
def pressed():
    file = request.files['file']   
    print(file) 
    file = Image.open(file)

    data = detection(file)
    print(data)
    return jsonify(data)



def detection(img):
    data = {
        'first': "",
        'middle': "",
        'last': ""
    }

    words = pytesseract.image_to_string(img)
    words = words.replace('\n', ' ')
    words = words.replace(',', '')
    words = words.split(' ')

    for word in words:
        if word == '':
            words.remove(word)

    data['LastName'] = words[0]
    data['FirstName'] = words[1]
    
    return data


    


if __name__ == '__main__':
    app.run(host='localhost',port=5000, debug=True)
    
    
