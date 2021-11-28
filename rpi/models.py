import json
from datetime import datetime
from crud import *
import os

RASPBERRY_OS = False
if RASPBERRY_OS:
    from camera import *

class Home:
    def __init__(self, name):
        self.name = name
        self.home_id = None
        self.password = None
        self.auth_token = None

        self.get_home_id() #Either gets the home_id or creates it

        print("Initialized home, with id", self.home_id)

    def get_home_id(self):
        if os.path.isfile('./data/home_id.json'):
            self.load_home_from_json()
        else:
            self.initialize_new_home_on_server()


    def load_home_from_json(self):
        with open('./data/home_id.json', 'r') as f: #Store the id on 'hard storage' as a JSON
            self.home_id = json.load(f)

        with open('./data/password.json', 'r') as f: #Store the id on 'hard storage' as a JSON
            self.password = json.load(f)

        with open('./data/auth_token.json', 'r') as f: #Store the id on 'hard storage' as a JSON
            self.auth_token = json.load(f)

    def initialize_new_home_on_server(self):
        response = post_home_data({'name': self.name})
        self.home_id = response.json()["response"]["home"]["_id"]
        self.password = response.json()["response"]["password"]
        self.store_home_id()
        self.store_password()
        self.auth_token = get_auth_token(self.home_id, self.password)
        self.store_auth_token()

    def store_home_id(self):
        if not os.path.isdir('./data'):
            os.mkdir('./data')
        with open('./data/home_id.json', 'w+') as f:
            json.dump(self.home_id, f)

    def store_password(self):
        with open('./data/password.json', 'w+') as f:
            json.dump(self.password, f)

    def store_auth_token(self):
        with open('./data/auth_token.json', 'w+') as f:
            json.dump(self.auth_token, f)

class Sensor:
    def __init__(self, name):
        self.name = name
        self.data = None

        self.load_data()
        
    def reset_json(self):
        #Since all of the data is already stored on the MongoDB server, we don't need to save more. Only enough locally
        #so we know we are not sending duplicates
        os.remove('./data/sensors/' + self.name + '.json')

    def load_data(self):
        # If data exists, load it 
        if os.path.isfile('./data/sensors/' + self.name + '.json'):
            with open('./data/sensors/' + self.name + '.json', 'r') as f:
                self.data = json.load(f)
        
        else: #Create the file
            if not os.path.isdir('./data/sensors'):
                os.mkdir('./data/sensors/')
            self.data = []
            self.update_json()
            
    def append_data(self,data):
        current_unix_time = int(datetime.strftime(datetime.utcnow(), "%s"))
        if self.data is None:
            self.data = []
        self.data.append({'timestamp': current_unix_time, 'data': data})
        self.update_json()
        
    def update_json(self):
        with open('./data/sensors/' + self.name + '.json', 'w+') as f:
            json.dump(self.data, f)

    def get_most_recent_data(self):
        try:
            return self.data[-1]['data']
        except:
            return None

    def get_name(self):
        return self.name

class IntruderSensor(Sensor): # The Intruder Sensor is just another sensor with extra functionalities. All sensors read either 0 or 1
    def append_data(self,data): # Overwrite original Sensor function
        current_unix_time = int(datetime.strftime(datetime.utcnow(), "%s"))
        if self.data is None:
            self.data = []

        if data == "0":
            data = False

        elif data == "1":
            data = True
        self.data.append({'timestamp': current_unix_time, 'data': data})


class Module: #Parent of IntruderModule and SensorModule
    def __init__(self, home_id):
        self._id = None
        self.name = None
        self.home_id = home_id
        self.sensors = [] # A dictionary where the key is the sensor_name, the value is just the object
        self.current_data = {}
        self.auth_token = None

        self.load_auth_token()


    def load_auth_token(self):
        with open('./data/auth_token.json', 'r') as f:
            self.auth_token = json.load(f)


    def add_sensors(self,*sensors):
        # Add one or multiple sensors
        for sensor in sensors:
            self.sensors.append(sensor)

    # Add a new sensor the sensors list with the new sensor_key
    def register_sensor(self, sensor_key):
        new_sensor = Sensor(sensor_key)
        self.sensors.append(new_sensor)

    def register_intruder_sensor(self, sensor_key):
        new_sensor = IntruderSensor(sensor_key)
        self.sensors.append(new_sensor)

    # Check if the sensor_key has already been registered
    def registered(self, sensor_key):
        for sensor in self.sensors:
            if sensor.get_name() == sensor_key:
                return True
        return False

    # Gets a sensor from the sensors list based on the sensor type
    def get_sensor(self, sensor_key):
        for sensor in self.sensors:
            if sensor.get_name() == sensor_key:
                return sensor

    def update_current_data(self):
        for sensor in self.sensors:
            if sensor.get_most_recent_data(): #If the recent data is not none
                self.current_data[sensor.name] = sensor.get_most_recent_data()


    def check_data_and_notify(self):#TODO: MAKE SURE NOT TO NOTIFY 100 times
        #TODO: Make sure the numbers are right, and test out notifications
        for sensor in self.sensors:
            title = ""
            info = ""
            
            # Logic for detecting anomalies in the sensors
            if sensor.get_most_recent_data():
                if sensor.name == 'temperature':
                    if float(sensor.get_most_recent_data()) > 30:
                        title = "Your house is overheating!"
                        info = "Your house is reaching a temperature of {}! Please check if it is on fire.".format(sensor.get_most_recent_data())

                elif sensor.name == 'humidity':
                    if float(sensor.get_most_recent_data()) > 70:
                        title = "High humidity detected!"
                        info = "Your house has reached a humidity above 70%, make sure to lower it"
                    elif float(sensor.get_most_recent_data()) < 30:
                        title = "Low humidity detected!"
                        info = "Your house has reached a humidity below 30%, make sure to increase it!"

                """
                elif sensor.name == 'light_level':
                    if sensor.get_most_recent_data() > 20:
                        title = "High light level detected!"
                        info = "Light level of {}".format(sensor.get_most_recent_data())


                elif sensor.name == 'moisture':
                    if sensor.get_most_recent_data() > 30:
                        title = "High moisture detected!"
                        info = "You have a moisture of level {}".format(sensor.get_most_recent_data())
                """


                if title != "" and info != "": #If there is a notification to be sent
                    response = put_notification_data({'id': self.home_id, 'notification': {'title': title, 'module_id': self._id, 'info': info}}, self.auth_token)
                    return response

class PlantModule(Module):
    def __init__(self, home_id):
        super().__init__(home_id)
        self.name = "Barry McHawk Inger's Plant Module"

        self.get_plant_module_id()

        print("Initialized plant module, with id", self._id)

    def get_plant_module_id(self):
        if os.path.isfile('./data/plant_module_id.json'):
            self.load_plant_module_id_from_json()
        else:
            self.initialize_new_plant_module_on_server()

    def initialize_new_plant_module_on_server(self):
        response = post_plant_data({'name': self.name,'home_id': self.home_id, 'current_data': self.current_data}, self.auth_token)
        self._id = response.json()["response"]["sensorResult"]["_id"]
        self.store_plant_module_id()

    def store_plant_module_id(self):
        with open('./data/plant_module_id.json', 'w+') as f: #Store the id on 'hard storage' as a JSOn
            json.dump(self._id, f)

    def load_plant_module_id_from_json(self):
        with open('./data/plant_module_id.json', 'r') as f: #Store the id on 'hard storage' as a JSOn
            self._id = json.load(f)

    def upload_data(self):
        final_object = self.current_data
        final_object['id'] = self._id

        # Rename keys because jackass Zac wants different names
        if 'plants_light_level' in final_object:
            final_object['light_level'] = final_object.pop('plants_light_level')
        if 'plants_moisture' in final_object:
            final_object['moisture'] = final_object.pop('plants_moisture')
        if 'plants_light_switch' in final_object:
            final_object['light_on'] = final_object.pop('plants_light_switch')
        if 'plants_watering' in final_object:
            final_object['num_water'] = final_object.pop('plants_watering')

        response = put_plant_data(final_object, self.auth_token)
        print(response)
        return response


class IntruderModule(Module):
    # Noise Sensor, Motion, door is open,
    def __init__(self, home_id):
        super().__init__(home_id) #Initialize parent class
        self.name = "Barry McHawk Inger's Intruder Module"
        self.previous_alert_level = 0 # Needed to detect transition
        self.alert_level = 0

        self.get_intruder_module_id()

        print("Initialized intruder module, with id", self._id)

    def register_sensor(self, sensor_key):
        new_sensor = IntruderSensor(sensor_key)
        self.sensors.append(new_sensor)

    def get_intruder_module_id(self):
        if os.path.isfile('./data/intruder_module_id.json'):
            self.load_intruder_module_id_from_json()
        else:
            self.initialize_new_intruder_module_on_server()

    def initialize_new_intruder_module_on_server(self):
        response = post_intruders_data({'name': self.name,'home_id': self.home_id, 'current_data': self.current_data}, self.auth_token)
        self._id = response.json()["response"]["intruderResult"]["_id"]
        self.store_intruder_module_id()

    def store_intruder_module_id(self):
        with open('./data/intruder_module_id.json', 'w+') as f: #Store the id on 'hard storage' as a JSOn
            json.dump(self._id, f)

    def load_intruder_module_id_from_json(self):
        with open('./data/intruder_module_id.json', 'r') as f: #Store the id on 'hard storage' as a JSOn
            self._id = json.load(f)

    def update_current_data(self):
        super(IntruderModule, self).update_current_data()
        self.update_alert_level()

    def update_alert_level(self):
        self.previous_alert_level = self.alert_level
        self.alert_level = 0
        for sensor in self.sensors:
            if sensor.get_most_recent_data(): #That sensor returned true
                if sensor.get_name() == 'intruders_window':
                    self.alert_level += 2

                elif sensor.get_name() == 'intruders_door':
                    self.alert_level += 4

                elif sensor.get_name() == 'intruders_motion':
                    self.alert_level += 4

    def create_detection_message(self):
        i = [0,0,0]
        for sensor in self.sensors:
            if sensor.get_most_recent_data(): #That sensor returned true
                if sensor.get_name() == 'intruders_window':
                    i[0] = 1

                elif sensor.get_name() == 'intruders_door':
                    i[1] = 1

                elif sensor.get_name() == 'intruders_motion':
                    i[2] = 1

        message = ""
        if i[0] and i[1] and i[2]:
            message = "URGENT! Someone broke into your house!"

        elif i[0] and i[1]:
            message = "URGENT! There is a high chance someone into your house!"

        elif i[0] and i[2]:
            message = "URGENT! There is a high chance someone broke into your house!"

        elif i[1] and i[2]:
            message = "URGENT! There is someone at your door!"

        elif i[0]:
            message = "Warning! Your window is open."

        elif i[1]:
            message = "Warning! Your door is open."

        elif i[2]:
            message = "Warning! There is motion in your house."

        else:
            message = "The threat has been eliminated."

        return message

    def upload_data(self): #Unlike the SensorModule, the IntruderModule only uploads data in certain cases
        # Case 1: The alert level is > 1
        # Case 2: The alert level just changed to 0

        # To prevent uploading 100 times, we check that there is a change in the alert level
        if (self.alert_level == 0 and self.previous_alert_level > 0) or self.previous_alert_level != self.alert_level and self.alert_level > 0:
            final_object = dict()
            final_object['id'] = self._id
            final_object['alert_level'] = self.alert_level
            final_object['detection'] = self.create_detection_message()

            response = put_intruders_data(final_object, self.auth_token)
            if (self.alert_level == 0 and self.previous_alert_level > 0) or response.json()['response']['notify']: # TODO: Change this to relevant
                return True

        return False

    def notify(self):
        info = self.create_detection_message()
        if info == "The threat has been eliminated.":
            title = "Intruder Gone"
        else:
            title = "Intruder Detection Triggered!"
        response = put_notification_data({'id': self.home_id, 'notification': {'title': title, 'module_id': self._id, 'info': info}}, self.auth_token)

        # Save image and upload image of the intruder
        if RASPBERRY_OS:
            capture_image_from_rpi_camera()
            post_image(self.home_id)

        return response




class SensorModule(Module): 
    # Includes Light Level, Humidity, Temperature, and Moisture Sensor
    def __init__(self, home_id):
        super().__init__(home_id) #Initialize parent class
        self.name = "Barry McHawk Inger's Sensor Module"
        self.current_data = {}

        self.get_sensor_module_id()

        print("Initialized sensor module, with id", self._id)

    def get_sensor_module_id(self):
        if os.path.isfile('./data/sensor_module_id.json'):
            self.load_sensor_module_id_from_json()
        else:
            self.initialize_new_sensor_module_on_server()

    def initialize_new_sensor_module_on_server(self):
        response = post_sensors_data({'name': self.name,'home_id': self.home_id, 'current_data': self.current_data}, self.auth_token)
        self._id = response.json()["response"]["sensorResult"]["_id"]
        self.store_sensor_module_id()

    def store_sensor_module_id(self):
        with open('./data/sensor_module_id.json', 'w+') as f: #Store the id on 'hard storage' as a JSOn
            json.dump(self._id, f)

    def load_sensor_module_id_from_json(self):
        with open('./data/sensor_module_id.json', 'r') as f: #Store the id on 'hard storage' as a JSOn
            self._id = json.load(f)

    def upload_data(self):
        final_object = self.current_data
        final_object['id'] = self._id

        response = put_sensors_data(final_object, self.auth_token)
        return response



