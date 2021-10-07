import requests

SERVER_ADDRESS = "159.89.119.204"
GET_DIRECTORY = "/get" #TODO: Discuss with Zac

HOME_URL = "/api/home"
SENSORS_URL = "/api/sensors"
INTRUDERS_URL = "/api/intruders"
USER_URL = "/api/user"

def post_data(json_data):
  response = requests.post(SERVER_ADDRESS, data=json_data)
  return response

def get_data(headers={}, payload={}):
  r = requests.get(SERVER_ADDRESS + SUB_URL, headers=headers, params=payload)

def put_data(json_data, sub_url):
  response = requests.put(SERVER_ADDRESS + sub_url, data=json_data)
  return response

def push_home_data(json_data):
  """
  {
	"name": "Example Home",
	"username": "barryhawkener@gmail.com",
	"modules" : [],
	"notifications": []
}	
  """
  push_data(json_data, HOME_URL)


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
  put_data(json_data, HOME_URL)
  

def push_sensors_data(json_data):
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
  push_data(json_data, SENSORS_URL)

def put_sensors_data(json_data):
  """Sample JSON 
  {
    "id": "615bd1fc329a7345d730d419",
    "temperature": 20,
    "humidity": 42,
    "light_level": 42
}
"""
  put_data(json_data, SENSORS_URL)
  

def push_intruders_data(json_data):
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
  push_data(json_data, INTRUDERS_URL)

def put_intruders_data(json_data):
  """Sample JSON 
  {
	"detection": "small noise level increase",
	"alert_level": 2
}
"""
  put_data(json_data, INTRUDERS_URL)
  

def push_user_data(json_data):
  """
{
	"username": "barryhawkener@gmail.com",
	"name": "Barry"
}	
  """
  push_data(json_data, USER_URL)

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
  put_data(json_data, USER_URL)
