from models import Home, Sensor, SensorModule, Intruder, IntruderModule
from crud import *
from helper import format_serial_data
from serial import Serial
from time import time
from datetime import date

def export_daily_data():
    current_date_string = date.today().strftime("%d-%m-%Y")
    
# Initialize the Home Module
home = Home("Gongster's Home")

# Initialize the Sensors Module
sensor_module = SensorModule(home.home_id)
temperature_sensor = Sensor('temperature')
humidity_sensor = Sensor('humidity')
light_sensor = Sensor('light_level')
moisture_sensor = Sensor('moisture')
sensor_module.add_sensors(temperature_sensor, humidity_sensor, light_sensor, moisture_sensor)


previous_time = time() #Initialize previous time
    
while True:

    ser = Serial(port='/dev/ttyS0', baudrate=9600, timeout=1)
    if (time() - previous_time > 10): #Been over 10 seconds, so we will read from sensors and upload to server
        # Open Serial
        data = ""
        # ser.write(str.encode('1'))
        # time.sleep(1)
        # #while ser.in_waiting:
        # s = ser.readline()
        # data += s.decode('UTF-8')

        # ser.write(str.encode('2'))
        # time.sleep(1)
        # s = ser.readline()
        # data += s.decode('UTF-8')

        data_dict = format_serial_data(data)

        
        """At a high level, we will all each sensor data be an object instance (stored as a python dict 
        but modeled as a class. It will be stored physically on a JSON file."""
        
        # Go over each of the sensor data and put it into the right JSON file
        for key in data_dict:
            # if sensor data
            if key in ['temperature', 'humidity', 'light_level', 'moisture']:
                for sensor_object in sensor_module.sensors:
                    if sensor_object.name == key:
                        sensor = sensor_object
                        break

                sensor.load_data()

                sensor.check_data_and_notify() # TODO:If something is wrong, we will send a notification

                sensor.append_data(data_dict[key])
                sensor.update_json()


            # If intruder data
            if key in ['intruder']:
                print("This is intruder data, I don't know how to handle it yet")
                

        sensor_module.update_current_data()
        sensor_module.upload_data()
        #TODO: Create Daily Data export function to send to server
        #TODO: Separate Data Handling and Send to server
    
    else: #Read intruder things from serial line
        previous_time = time() #Update time

        s = ser.readline()
        data += s.decode('UTF-8')

        data_dict = format_serial_data(data)