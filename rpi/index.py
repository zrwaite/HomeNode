from models import *
from crud import *
from serial import Serial
import time
from datetime import date

def export_daily_data():
    current_date_string = date.today().strftime("%d-%m-%Y")
    
while True:

    # Open Serial
    # ser = Serial(port='/dev/ttyS0', baudrate=9600)  # open serial port
    # ser.write(str.encode('1'))

    time.sleep(1)

    # s = ser.readline()    
    # data = s.decode('UTF-8')
    data = "humidity/48.00/temperature/22.50" 
    data_list = data.split('/')
    
    data_dict = {}
    for index, value in enumerate(data_list):
        if index % 2 == 0:
            data_dict[data_list[index]] = float(data_list[index+1].replace('\\','').strip())
        
    
    """At a high level, we will all each sensor data be an object instance (stored as a python dict 
    but modeled as a class. It will be stored physically on a JSON file."""
     
    # Go over each of the sensor data and put it into the right JSON file
    for key in data_dict:

        # if sensor data
        if key in ['temperature', 'humidity']:
            sensor = Sensor(key) 
            sensor.load_data()
            sensor.append_data(data_dict[key])
            sensor.update_json() 
        
        # If intruder data
        if key in ['intruder']:
            print("This is intruder data, I don't know how to handle it yet")
            
    
    # with open('./data/' + current_date_string, 'a') as f:
    #     json.dump(data_dict, f)
    
    
    #TODO: Create Daily Data export function to send to sever
    #TODO: Separate Data Handling and Send to server
    
    
    # r = put_sensors_data(data_dict)
    # print(r.text)
