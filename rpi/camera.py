from picamera import PiCamera

def capture_image_from_rpi_camera():
    camera = PiCamera()
    camera.capture('./images/picture.jpg')

