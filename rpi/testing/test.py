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


    #Download random image from the internet
    with open('./images/picture.jpg', 'wb') as handle:
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
        sensor = IntruderSensor('motion')
        sensor.append_data("1")
        sensor.update_json()
        self.assertEqual(sensor.get_most_recent_data(), True)

    def test_intruder_sensor_alert_level(self):
        sensor = IntruderSensor('motion')
        self.intruder_module.add_sensors(sensor)
        sensor.append_data("1")
        self.intruder_module.update_alert_level()
        self.assertEqual(self.intruder_module.alert_level, 4)
        self.assertEqual(self.intruder_module.previous_alert_level, 0)

        sensor.append_data("0")
        self.intruder_module.update_alert_level()
        self.assertEqual(self.intruder_module.alert_level, 0)
        self.assertEqual(self.intruder_module.previous_alert_level, 4)

        window_sensor = IntruderSensor('window')
        self.intruder_module.add_sensors(window_sensor)
        sensor.append_data("1")
        window_sensor.append_data("1")
        self.intruder_module.update_alert_level()
        self.assertEqual(self.intruder_module.alert_level, 6)
        self.assertEqual(self.intruder_module.previous_alert_level, 0)


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
        self.motion_sensor = IntruderSensor('motion')
        self.window_sensor = IntruderSensor('window')
        self.door_sensor = IntruderSensor('door')
        self.intruder_module.add_sensors(self.motion_sensor, self.window_sensor, self.door_sensor)

        # Initialize Plant Module
        self.plant_module = PlantModule(self.home.home_id)
        self.light_sensor = Sensor('plant_light_level')
        self.moisture_sensor = Sensor('plant_moisture')
        self.watering_sensor = Sensor('plant_watering')
        self.light_switch_sensor = Sensor('plant_light_switch')

    def tearDown(self):
        delete_home_data(self.home.home_id, self.home.auth_token)
        shutil.rmtree('./data')

    def testSensorPushNotificationToServer(self):
        self.temperature_sensor.append_data(50)
        print(self.sensor_module.sensors[0].get_most_recent_data())
        response = self.sensor_module.check_data_and_notify()
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['response']['notifications'][0]['title'], "Your house is overheating!")

    # def testIntruderSensorPushNotificationToServer(self):
    #     self.motion_sensor.append_data("1")
    #     notify = self.intruder_module.upload_data()
    #     response = self.intruder_module.check_data_and_notify()
    #     self.assertEqual(response.json()['success'], True)
    #     self.assertEqual(response.json()['response']['notifications'][0]['title'], "Your house is overheating!")

    # def testThreatElimination(self):


if __name__ == '__main__':
    unittest.main()

from rpi.models import *
from rpi.crud import *
