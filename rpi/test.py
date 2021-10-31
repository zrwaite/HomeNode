import unittest


class TestSum(unittest.TestCase):
    def test_list_int(self):
        data = [1, 2, 3, 4, 5]
        result = sum(data)
        self.assertEqual(result, 15)

class TestSensor(unittest.TestCase):
    def test_sensor_creation():
        sensor = Sensor('humidity')
        sensor.load_data()
        sensor.append_data(50)
        sensor.update_json()