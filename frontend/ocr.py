import pytesseract
import cv2
import matplotlib.pyplot as plt
from flask import Flask, render_template


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/buttonpress')
def pressed(img):
    detection(img)


def image_preprocess():
    pass

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

    data['last'] = words[0]
    data['first'] = words[1]
    
    return data


    

if __name__ == '__main__':
    app.run(port=3000, debug=True)
    
