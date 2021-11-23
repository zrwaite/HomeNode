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

    def tearDown(self) -> None:
        delete_home_data(self.home.home_id, self.home.auth_token)
        shutil.rmtree('./data')

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
        self.light_sensor = Sensor('light_level')
        self.moisture_sensor = Sensor('moisture')
        self.sensor_module.add_sensors(self.temperature_sensor, self.humidity_sensor, self.light_sensor, self.moisture_sensor)

        # Initialize Intruders Module
        self.intruder_module = IntruderModule(self.home.home_id)
        self.motion_sensor = Sensor('motion')
        self.intruder_module.add_sensors(self.motion_sensor)

    def tearDown(self):
        delete_home_data(self.home.home_id, self.home.auth_token)
        shutil.rmtree('./data')

    def testPushNotificationToServer(self):
        self.temperature_sensor.append_data(100)
        print(self.sensor_module.sensors[0].get_most_recent_data())
        response = self.sensor_module.check_data_and_notify()
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['response']['notifications'][0]['title'], "Your house is overheating!")


if __name__ == '__main__':
    unittest.main()

from rpi.models import *
from rpi.crud import *
