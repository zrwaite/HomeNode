from picamera import PiCamera

def capture_image_from_rpi_camera():
    if not os.path.isdir('./images'):
        os.mkdir('./images')
    camera = PiCamera()
    camera.capture('./images/picture.jpg')

