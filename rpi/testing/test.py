# Files for unit testing
import unittest
import os
import sys
import shutil

if __name__ == '__main__':
    devpath = os.path.relpath(os.path.join('..'),
                              start=os.path.dirname(__file__))
    sys.path = [devpath] + sys.path

from models import *
from crud import *

# CRUD Stuff
class TestCrud(unittest.TestCase):
    '''
    Conduct Crud testing. Creation of new Homes, Modules, as well as delete it during teardown
    '''

    def setUp(self) -> None:
        self.home = Home('New Test Home')
        self.sensor_module = SensorModule(self.home.home_id)
        self.intruder_module = IntruderModule(self.home.home_id)
        self.plant_module = PlantModule(self.home.home_id)

        if not os.path.isdir('./data'):
            os.mkdir('./data')

        if not os.path.isdir('./images'):
            os.mkdir('./images')

        #Download random image from the internet
        with open('./images/picture.jpg', 'w') as handle:
            response = requests.get("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.jpg", stream=True)
            if not response.ok:
                print(response)
            for block in response.iter_content(1024):
                if not block:
                    handle.write(block)

    def tearDown(self) -> None:
        delete_home_data(self.home.home_id, self.home.auth_token)
        shutil.rmtree('./data')
        shutil.rmtree('./images')


    # def testImageUpload(self):
    #     response = post_image()
    #     self.assertEqual(response.json().status, '200')

    def testHomeInitialization(self):
        self.assertIsNotNone(self.home.home_id)

    def testSensorModuleInitialization(self):
        self.assertIsNotNone(self.sensor_module._id)
        self.assertIsNotNone(self.sensor_module.auth_token)

    def testIntruderModuleInitialization(self):
        self.assertIsNotNone(self.intruder_module._id)
        self.assertIsNotNone(self.intruder_module.auth_token)

    def testPlantModuleInitialization(self):
        self.assertIsNotNone(self.plant_module._id)
        self.assertIsNotNone(self.plant_module.auth_token)

    def testImageUpload(self):
        response = post_image(self.intruder_module.home_id)
        print(response.json())
        self.assertEqual(response.json().status, 200)


class TestModels(unittest.TestCase):
    def setUp(self):
        self.home = Home('New Test Home')
        self.sensor_module = SensorModule(self.home.home_id)
        self.intruder_module = IntruderModule(self.home.home_id)
        self.plant_module = PlantModule(self.home.home_id)

        # Set up the directory
        if not os.path.isdir('./data'):
            os.mkdir('./data')

    def tearDown(self):
        delete_home_data(self.home.home_id, self.home.auth_token)
        shutil.rmtree('./data')

    def test_sensor_append_data(self):
        sensor = Sensor('humidity')
        sensor.append_data(50)
        sensor.update_json()
        self.assertEqual(sensor.get_most_recent_data(), 50)

    def test_intruder_sensor_append_data(self):
        # 'motion', 'door', 'window'
        sensor = IntruderSensor('intruders_motion')
        sensor.append_data("1")
        sensor.update_json()
        self.assertEqual(sensor.get_most_recent_data(), True)

    def test_intruder_sensor_alert_level(self):
        sensor = IntruderSensor('intruders_motion')
        self.intruder_module.add_sensors(sensor)
        sensor.append_data("1")
        self.intruder_module.update_current_data()
        self.assertEqual(self.intruder_module.alert_level, 4)
        self.assertEqual(self.intruder_module.previous_alert_level, 0)

        sensor.append_data("0")
        self.intruder_module.update_current_data()
        self.assertEqual(self.intruder_module.alert_level, 0)
        self.assertEqual(self.intruder_module.previous_alert_level, 4)

        window_sensor = IntruderSensor('intruders_window')
        self.intruder_module.add_sensors(window_sensor)
        sensor.append_data("1")
        window_sensor.append_data("1")
        self.intruder_module.update_current_data()
        self.assertEqual(self.intruder_module.alert_level, 6)
        self.assertEqual(self.intruder_module.previous_alert_level, 0)

    def test_plant_sensor(self): # TODO: Fix plant
        sensor = Sensor('plants_light_level')
        sensor = Sensor('plants_moisture')
        self.plant_module.add_sensors(sensor)


class TestIntegrationMethods(unittest.TestCase):
    '''
    Conduct integration testing. This makes sure every feature works together.

    Things we want to make sure works:
    - Initializing the home and using that id to initialize the sensors
    '''
    def setUp(self):
        # Set up the data
        if not os.path.isdir('./data'):
            os.mkdir('./data')

        # Initialize Home
        self.home = Home('Integration Test Home')

        # Initialize Sensors Module
        self.sensor_module = SensorModule(self.home.home_id)
        self.temperature_sensor = Sensor('temperature')
        self.humidity_sensor = Sensor('humidity')
        self.sensor_module.add_sensors(self.temperature_sensor, self.humidity_sensor)

        # Initialize Intruders Module
        self.intruder_module = IntruderModule(self.home.home_id)
        self.motion_sensor = IntruderSensor('intruders_motion')
        self.window_sensor = IntruderSensor('intruders_window')
        self.door_sensor = IntruderSensor('intruders_door')
        self.intruder_module.add_sensors(self.motion_sensor, self.window_sensor, self.door_sensor)

        # Initialize Plant Module
        self.plant_module = PlantModule(self.home.home_id)
        self.light_sensor = Sensor('plants_light_level')
        self.moisture_sensor = Sensor('plants_moisture')
        self.watering_sensor = Sensor('plants_watering')
        self.light_switch_sensor = Sensor('plants_light_switch')
        self.plant_module.add_sensors(self.light_sensor, self.moisture_sensor, self.watering_sensor, self.light_switch_sensor)

    def tearDown(self):
        delete_home_data(self.home.home_id, self.home.auth_token)
        shutil.rmtree('./data')

    def testSensorPushNotificationToServer(self):
        self.temperature_sensor.append_data(50)
        print(self.sensor_module.sensors[0].get_most_recent_data())
        response = self.sensor_module.check_data_and_notify()
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['response']['notifications'][-1]['title'], "Your house is overheating!")

    def testIntruderSensorPushNotificationToServer(self):
        self.motion_sensor.append_data("1")
        self.window_sensor.append_data("1")
        self.intruder_module.update_current_data()
        notify = self.intruder_module.upload_data()
        self.assertEqual(notify, True)
        self.assertEqual(self.intruder_module.alert_level, 6)
        response = self.intruder_module.notify()
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['response']['notifications'][-1]['title'], "Intruder Detection Triggered!")
        self.assertEqual(response.json()['response']['notifications'][-1]['info'], "URGENT! There is a high chance someone broke into your house!")
        self.motion_sensor.append_data("0")
        self.window_sensor.append_data("0")
        self.intruder_module.update_current_data()
        self.assertEqual(self.intruder_module.alert_level, 0)
        self.assertEqual(self.intruder_module.previous_alert_level, 6)
        notify = self.intruder_module.upload_data()
        self.assertEqual(notify, True)
        response = self.intruder_module.notify()
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['response']['notifications'][-1]['title'], "Intruder Gone")
        self.assertEqual(response.json()['response']['notifications'][-1]['info'], "The threat has been eliminated.")

    def testPlantPutData(self):
        self.light_sensor.append_data(50)
        self.moisture_sensor.append_data(20)
        self.plant_module.update_current_data()
        response = self.plant_module.upload_data()
        print(response.json())
        self.assertEqual(response.json()['success'], True)



if __name__ == '__main__':
    unittest.main()

from rpi.models import *
from rpi.crud import *
