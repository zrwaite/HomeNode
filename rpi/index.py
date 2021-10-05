import requests

SERVER_ADDRESS = "159.89.119.204"
GET_DIRECTORY = "/get" #TODO: Discuss with Zac

def post_data(json_data):
  response = requests.post(SERVER_ADDRESS, data=json_data)
  return response

def get_data(headers={}, payload={}):
  r = requests.get(SERVER_ADDRESS + SUB_URL, headers=headers, params=payload)

def put_data(json_data):
  response = requests.put(SERVER_ADDRESS, data=json_data)
  return response

