#TODO: Convert these JSON objects into Python Classes and objects
import json

class Home:
  def __init__(self, name, username):
    self.name = name
    self.username = username

  = {
	"name": "Example Home",
	"username": "barryhawkener@gmail.com",
	"modules" : [
		{
			"type": "sensors",
			"module_id": "1oiuhf98239hij:" 
		},
		{
			"type": "intruder",
			"module_id":"slakjhsf98289"
		},
		{
			"type": "plant",
			"module_id": "209385934hfhjk"
		}
	],
	"alerts": [
		{
			"title": "Temperature very high",
			"moduleid": "1oiuhf98239hij",
			"info": "Current Temperature: 35 degrees. Quite high.",
			"timestamp": "23454324567",
			"read": true
		}
	]
  }	

intruders = {
	"name": "Barry's Intrusion detection",
	"username": "barryhawkener@gmail.com",
	"current_data": {
		"timestamp":12392938490,
		"on": true,
		"powered": true,
		"intrusion_detected": false
	},
	"daily_data" : [
		{
			"timestamp": 12392938490,
			"detection": "small noise level increase",
			"alert_level": 2
		}, 
		{
			"timestamp": 12392939490,
			"detection": "slight motion possible",
			"alert_level": 3
		},
		{
			"timestamp": 12392940500,
			"detection": "small noise level increase",
			"alert_level": 2
		}
	],
	"past_data": [
		{
			"date": "10/03/2021",
			"intrusion_detections": false
		},
		{
			"date": "10/02/2021",
			"intrusion_detections": false
		},
		{
			"date": "10/01/2021",
			"intrusion_detections": true
		},
		{
			"date": "09/30/2021",
			"intrusion_detections": false
		}
	]
}	

class Sensors:
  def __init__(self, 
  = {
	"name": "Barry's Sensors",
	"username": "barryhawkener@gmail.com",
	"home_id" : "isdahjk893kbj",
	"current_data": {
		"timestamp":12392938490,
		"temperature": 20,
		"humidity": 50,
		"light_level": 40
	},
	"daily_data" : [
		{
			"timestamp": 12392938490,
			"temperature": 20,
			"humidity": 20,
			"light_level": 20
		}, 
		{
			"timestamp": 12392939490,
			"temperature": 22
		},
		{
			"timestamp": 12392940500,
			"light_level": 50
		},
		{
			"timestamp": 12392942000,
			"humidity": 30
		}		
	],
	"past_data": [
		{
			"date": "10/03/2021",
			"average_temperature": 21,
			"average_humidity": 35,
			"average_light_level": 20
		},
		{
			"date": "10/02/2021",
			"average_temperature": 24,
			"average_humidity": 45,
			"average_light_level": 30
		},
		{
			"date": "10/01/2021",
			"average_temperature": 18,
			"average_humidity": 30,
			"average_light_level": 20
		},
		{
			"date": "09/30/2021",
			"average_temperature": 19,
			"average_humidity": 25,
			"average_light_level": 25
		}
	]
}	

class User:
  def __init__(self, name, username):
    self.name = name
    self.username = username

 
user = {
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
