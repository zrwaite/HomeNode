import json
import requests

SERVER_ADDRESS = "http://homenode.tech/api"

HOME_URL = "/home"
SENSORS_URL = "/sensors"
INTRUDERS_URL = "/intruders"
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

def put_data(python_dict, sub_url):
  response = requests.put(SERVER_ADDRESS + sub_url, json=python_dict)
  return response

def post_home_data(python_dict):
  response = post_data(python_dict, HOME_URL)
  return response

def put_home_data(python_dict):
  response = put_data(python_dict, HOME_URL)
  return response

def post_sensors_data(python_dict):
  response = post_data(python_dict, SENSORS_URL)
  return response

def put_sensors_data(python_dict):
  response = put_data(python_dict, SENSORS_URL)
  return response
  
def post_intruders_data(python_dict):
  response = post_data(python_dict, INTRUDERS_URL)
  return response

def put_intruders_data(python_dict):
  response = put_data(python_dict, INTRUDERS_URL)
  return response
  
def post_user_data(python_dict):
  response = post_data(python_dict, USER_URL)
  return response

def put_user_data(python_dict):
  response = put_data(python_dict, USER_URL)
  return response
