#TODO: Convert these JSON objects into Python Classes and objects
import json
from datetime import datetime
import os

class Home:
  def __init__(self, name, username):
    self.name = name
    self.username = username


class IntruderModule:
    def __init__(self, id, name):
        self._id = id 
        self.name = name
        self.home_id = "isdahjk893kbj"

class Intruder:
    def __init__(self, name):
        self.name = name

class SensorModule: 
    def __init__(self, id, name):
        self._id = id 
        self.name = name
        self.home_id = "isdahjk893kbj"
        self.sensors = []
        self.current_data = {}
        
    def add_sensors(self,*sensors):
        for sensor in sensors:
            self.sensors.append(sensor)

    def update_current_data(self):
        for sensor in self.sensors:
            self.current_data[sensor.name] = sensor.most_recent_data

    def export_daily_data(self): #The daily data is all of the data in a given day, the raspberry pi wipes the data every day
        for sensor in self.sensors:
            print(sensor)

class Sensor:
    def __init__(self, name):
        self.name = name
        self.most_recent_data = None
        self.data = None
        
    def reset_json(self):
        #Since all of the data is already stored on the MongoDB server, we don't need to save more. Only enough locally
        #so we know we are not sending duplicates
        os.remove('./data/sensors/' + self.name + '.json')

    def load_data(self):
        # If data exists, load it 
        if (os.path.isfile('./data/sensors/' + self.name + '.json')):
            with open('./data/sensors/' + self.name + '.json', 'r') as f:
                self.data = json.load(f)
        
        else: #Create the file
            self.data = []
            self.update_json()
            
        
    
    def append_data(self,data):
        current_unix_time = int(datetime.strftime(datetime.utcnow(), "%s"))
        if self.data == None:
            self.data = []
        self.data.append({'timestamp': current_unix_time, 'data': data})
        
    def update_json(self):
        with open('./data/sensors/' + self.name + '.json', 'w+') as f:
            print(self.data)
            json.dump(self.data, f)
