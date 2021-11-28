from picamera import PiCamera
import os

def capture_image_from_rpi_camera():
    if not os.path.isdir('./images'):
        os.mkdir('./images')
    camera = PiCamera()
    camera.capture('./images/picture.jpg')

