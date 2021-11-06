import json
import requests

SERVER_ADDRESS = "http://homenode.tech/api"

HOME_URL = "/home"
SENSORS_URL = "/sensors"
INTRUDERS_URL = "/intruders?put_type=daily_data"
USER_URL = "/user"

def parse_to_json(python_object):
  return json.dumps(python_object, separators=(',', ':'))

def unparse_to_json(json_string):
  return json.loads(json_string)

#POST / PUT / GET / DELETE Functions
def test_post_data(python_dict):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.post('https://httpbin.org/post', headers=headers, json=python_dict)
  return response
  
def test_put_data(python_dict):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.put('https://httpbin.org/put', headers=headers, json=python_dict)
  return response
  
def post_data(python_dict, sub_url):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.post(SERVER_ADDRESS + sub_url, headers=headers, json=python_dict)
  return response

def get_data(sub_url, headers={}, payload={}):
  response = requests.get(SERVER_ADDRESS + sub_url, headers=headers, params=payload)
  return response

def get_all_data():
  response = get_data("/sensors?all=true")
  return response

def put_data(python_dict, sub_url):
  response = requests.put(SERVER_ADDRESS + sub_url, json=python_dict)
  return response

def post_home_data(python_dict):
  response = post_data(python_dict, "/home")
  return response

def put_home_data(python_dict):
  response = put_data(python_dict, "/home?put_type=sensors")
  return response

def post_sensors_data(python_dict):
  response = post_data(python_dict, "/sensors")
  return response

def put_sensors_data(python_dict):
  response = put_data(python_dict, "/sensors?put_type=sensors")
  return response
  
def post_intruders_data(python_dict):
  response = post_data(python_dict, "/intruders")
  return response

def put_intruders_data(python_dict):
  response = put_data(python_dict, "/intruders?put_type=daily_data")
  return response
  
def post_user_data(python_dict):
  response = post_data(python_dict, "/user")
  return response

def put_user_data(python_dict):
  response = put_data(python_dict, "/user?put_type=user")
  return response
