import json
import requests
import os

SERVER_ADDRESS = "http://homenode.tech/api"

HOME_URL = "/home"
SENSORS_URL = "/sensors"
INTRUDERS_URL = "/intruders?put_type=daily_data"
USER_URL = "/user"


IMAGE_URL = "/rpicamera"
path_img = './images/picture.jpg'

def post_image():
  with open(path_img, 'rb') as img:
    name_img= os.path.basename(path_img)
    files= {'image': (name_img,img,'multipart/form-data',{'Expires': '0'}) }
    with requests.Session() as s:
      response = s.post(SERVER_ADDRESS + IMAGE_URL,files=files)
      print(response.json())

def parse_to_json(python_object):
  return json.dumps(python_object, separators=(',', ':'))

def unparse_to_json(json_string):
  return json.loads(json_string)

# HOME AUTHENTICATION
def get_auth_token(home_id, password):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.post("http://homenode.tech/auth/token", headers=headers, json={'home_id': home_id, 'password': password})
  return response.json()['response']['token']

#POST / PUT / GET/ DELETE Functions
def test_post_data(python_dict):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.post('https://httpbin.org/post', headers=headers, json=python_dict)
  return response
  
def test_put_data(python_dict):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  response = requests.put('https://httpbin.org/put', headers=headers, json=python_dict)
  return response
  
def post_data(python_dict, sub_url, auth_token=None):
  headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

  if auth_token:
    headers['Authorization'] = 'Bearer ' + str(auth_token)

  response = requests.post(SERVER_ADDRESS + sub_url, headers=headers, json=python_dict)
  return response

def get_data(sub_url, headers={}, payload={}):
  response = requests.get(SERVER_ADDRESS + sub_url, headers=headers, params=payload)
  return response

def get_all_data():
  response = get_data("/sensors?all=true")
  return response

# To do: check put
def put_data(python_dict, sub_url, auth_token=None):
  if auth_token:
    headers = {'Authorization': 'Bearer ' + str(auth_token)}
    response = requests.put(SERVER_ADDRESS + sub_url, json=python_dict, headers=headers)
  else:
    response = requests.put(SERVER_ADDRESS + sub_url, json=python_dict)

  return response

def delete_home_data(home_id, auth_token):
  headers = {'Authorization': 'Bearer ' + str(auth_token)}
  response = requests.delete(SERVER_ADDRESS + '/home?delete_type=home', json={'id': home_id}, headers=headers)
  return response

def post_home_data(python_dict):
  response = post_data(python_dict, "/home")
  return response

def put_notification_data(python_dict, auth_token):
  response = put_data(python_dict, "/home?put_type=notification", auth_token)
  return response

def post_sensors_data(python_dict, auth_token):
  response = post_data(python_dict, "/sensors",auth_token)
  return response

def put_sensors_data(python_dict, auth_token):
  response = put_data(python_dict, "/sensors?put_type=daily_data", auth_token)
  return response
  
def post_intruders_data(python_dict, auth_token):
  response = post_data(python_dict, "/intruders", auth_token)
  return response

def put_intruders_data(python_dict, auth_token):
  response = put_data(python_dict, "/intruders?put_type=daily_data", auth_token)
  return response

def post_plant_data(python_dict, auth_token):
  response = post_data(python_dict, "/plants", auth_token)
  return response

def put_plant_data(python_dict, auth_token):
  response = put_data(python_dict, "/plants?put_type=daily_data", auth_token)
  return response
