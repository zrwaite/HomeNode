#TODO: Convert these JSON objects into Python Classes and objects
import json
from datetime import datetime
import os

class Home:
  def __init__(self, name, username):
    self.name = name
    self.username = username


class IntruderModule:
    def __init__(self):
        self._id = id 
        self.name = name
        self.home_id = "isdahjk893kbj"

class SensorModule: #TODO: Create children
    def __init__(self, id, name, ):
        self._id = id 
        self.name = name
        self.home_id = "isdahjk893kbj"

class Sensor:
    def __init__(self, name):
        self.name = name
        self.data = None
        
        

    def load_data(self):
        # If data exists, load it 
        if (os.path.isfile('./data/sensors/' + self.name + '.json')):
            with open('./data/sensors/' + self.name + '.json', 'r') as f:
                self.data = json.load(f)
        
    
    def append_data(self,data):
        current_unix_time = int(datetime.strftime(datetime.utcnow(), "%s"))
        if self.data == None:
            self.data = []
        self.data.append({'timestamp': current_unix_time, 'data': data})
        
    def update_json(self):
        with open('./data/sensors/' + self.name + '.json', 'w+') as f:
            print(self.data)
            json.dump(self.data, f)


sensor = Sensor('humidity')
sensor.load_data()
sensor.append_data(50)
sensor.update_json()