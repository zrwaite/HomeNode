import requests
import simplejson
import json
from serial import Serial
import time

SERVER_ADDRESS = "http://homenode.tech/api"

HOME_URL = "/home"
SENSORS_URL = "/sensors"
INTRUDERS_URL = "/intruders"
USER_URL = "/user"


# Not really needed since the requests library accepts python dictionaries
def parse_to_json(python_object):
  return json.dumps(python_object, separators=(',', ':')) 

def unparse_to_json(json_string):
  return json.loads(json_data)

def test_post_data(json_data):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.post('https://httpbin.org/post', headers=headers, data=json_data)
  return response
  
def test_put_data(json_data):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.put('https://httpbin.org/put', headers=headers, data=json_data)
  return response
  
def post_data(json_data, sub_url):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.post(SERVER_ADDRESS + sub_url, headers=headers, data=json_data)
  return response


def get_data(sub_url, headers={}, payload={}):
  response = requests.get(SERVER_ADDRESS + sub_url, headers=headers, params=payload)
  return response

def put_data(json_data, sub_url):
  response = requests.put(SERVER_ADDRESS + sub_url, data=json_data)
  return response

def post_home_data(json_data):
  """
  {
	"name": "Example Home",
	"username": "barryhawkener@gmail.com",
	"modules" : [],
	"notifications": []
}	
  """
  response = post_data(json_data, HOME_URL)
  return response


def put_home_data(json_data):
  """Sample JSON 
{
	"username": "barryhawkener@gmail.com",
	"name": "Barry",
	"homes": [
		{
			"name": "Example Home",
			"home_id": "1287hga8dbhj9",
			"default": true
		}
	],
	"settings": {
		"dark_mode": true,
		"email_notifications": true
	}	
}	
  """
  response = put_data(json_data, HOME_URL)
  return response

  

def post_sensors_data(json_data):
  """
{
	"name": "Barry's Sensors",
	"username": "barryhawkener@gmail.com",
	"home_id" : "isdahjk893kbj",
	"current_data": {
		"temperature": 20,
		"humidity": 50,
		"light_level": 40
	}
}	
  """
  response = post_data(json_data, SENSORS_URL)
  return response

def put_sensors_data(json_data):
  """Sample JSON 
  {
    "id": "615bd1fc329a7345d730d419",
    "temperature": 20,
    "humidity": 42,
    "light_level": 42
}
"""
  response = put_data(json_data, SENSORS_URL)
  return response
  

def post_intruders_data(json_data):
  """
  {
	"name": "Barry's Intrusion detection",
	"username": "barryhawkener@gmail.com",
	"home_id" : "isdahjk893kbj",
	"current_data": {
		"on": true,
		"powered": true,
		"intrusion_detected": false
	}
}	
  """
  response = post_data(json_data, INTRUDERS_URL)
  return response

def put_intruders_data(json_data):
  """Sample JSON 
  {
	"detection": "small noise level increase",
	"alert_level": 2
}
"""
  response = put_data(json_data, INTRUDERS_URL)
  return response
  
def post_user_data(json_data):
  """
{
	"username": "barryhawkener@gmail.com",
	"name": "Barry"
}	
  """
  response = post_data(json_data, USER_URL)
  return response

def put_user_data(json_data):
  """
  {
	"homes": [
		{
			"name": "Example Home",
			"home_id": "1287hga8dbhj9",
			"default": true
		}
	],
	"settings": {
		"dark_mode": true,
		"email_notifications": true
	}
}
"""
  response = put_data(json_data, USER_URL)
  return response

test = {
    "id": "616b7f4a3a200197bf2207ee",
    "light_level": 41,
    "temperature": 21,
    "humidity": 41
}


# This doesn't work
response = put_sensors_data(parse_to_json(test))
print(response.text)


'''This WORKS, it still has the backslashes...
test = {'name': 'Zach'}
response = test_post_data(parse_to_json(test))
print(response.text)
response = post_home_data(parse_to_json(test))
print(response.text)
'''

# while True:
#     # Open Serial
#     ser = Serial(port='/dev/ttyS0', baudrate=9600)  # open serial port
#     ser.write(str.encode('1'))

#     time.sleep(1)

#     s = ser.readline()    
#     data = s.decode('UTF-8')
    
#     data_list = data.split('/')
    
#     data_dict = {}
#     for index, value in enumerate(data_list):
#         if index % 2 == 0:
#             data_dict[data_list[index]] = float(data_list[index+1].replace('\\','').strip())
        
#     print(data_dict)
    
#     data_dict['id'] = "616b7f4a3a200197bf2207ee"
#     r = put_sensors_data((data_dict))
#     print(r.text)
