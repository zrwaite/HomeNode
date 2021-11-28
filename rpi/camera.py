from picamera import PiCamera

def captureImage():
    camera = PiCamera()
    camera.capture('./images/picture.jpg')

