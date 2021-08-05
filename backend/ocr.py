import pytesseract
import cv2
import matplotlib.pyplot as plt
import re

img = cv2.imread('./minke/cropped3.png')

def image_preprocess():
    pass

def detection():
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
    #print(words)
    print(detection())
    
