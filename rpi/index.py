from models import Home, SensorModule, IntruderModule, PlantModule
from serial import Serial
from time import perf_counter
from datetime import date

# Returns a string of concatenated messages
def request_messages(ser):
	messages_buffer = ''
	# Send ~ to lock the serial stream
	ser.write(str.encode('~'))

	# Request from every possible address
	for i in range(5):
		ser.write(str.encode('a'+str(i+1)))
		buf = ser.readline()
		messages_buffer += buf.decode('UTF-8')

	# Send & to unlock the serial stream
	ser.write(str.encode('&'))

	return messages_buffer

# Processes a string of messages into a dict with significant data
def process_messages(messages):
	# If there are no messages we don't have to do anything
	if not messages:
		return messages

	# Clean up the messages buffer
	messages = messages.replace('\\','/').replace('\n','').replace('\r','')

	# Create a messages list based on delimiter /
	messages = messages.split('/')

	# Create a dict with keys of sensor id and values of the sensor
	data_dict = {}
	for index, message in zip(range(int(len(messages)/2)), messages):
		# Check if there is any sensor data
		if messages[index * 2 + 1]:
			data_dict[messages[index * 2]] = messages[index * 2 + 1] 


	return data_dict

# Currently returns the sum of all the detected alerts and returns that as the alert level
def read_alerts(ser, intruder_module):
	alerts_buffer = ''

	# Get all the alerts in the buffer
	buf = ser.readline()
	alerts_buffer += buf.decode('UTF-8')

	# Since alerts are in the same format as messages, we can use the same process function
	data_dict = process_messages(alerts_buffer)

	if data_dict:
		print(data_dict)
		for key, value in data_dict.items():
			# Register the sensor type if it has not been registered
			if not intruder_module.registered(key):
				intruder_module.register_sensor(key)

			sensor = intruder_module.get_sensor(key)
			# Upload data
			sensor.load_data()

			sensor.append_data(value)

		intruder_module.update_current_data()
		print('current: '+str(intruder_module.alert_level))
		notify = intruder_module.upload_data()
		if notify:
			intruder_module.check_data_and_notify()

def index_main():

	# Initialize the Home Module
	home = Home("Barry McHawk Inger's Home")
	sensor_module = SensorModule(home.home_id)
	intruder_module = IntruderModule(home.home_id)
	plant_module = PlantModule(home.home_id)

	# Define serial connection
	ser = Serial(
		port='/dev/ttyS0', # Built-in serial port 
		baudrate=9600, # Baudrate on the modules
		timeout=1 # If no response in these amount of seconds, assume no data
	)


	# Time since last data request
	request_timer = perf_counter()

	# Main loop 
	while True:
		
		# Check if it is time to send a request
		if perf_counter() - request_timer > 3:

			# Request data from the modules
			data_buffer = request_messages(ser)

			# Process the messages into a dict if there are any
			data_dict = {}
			if data_buffer:
				data_dict = process_messages(data_buffer)

			# Post data from non-empty dicts
			if data_dict:
				print(data_dict)
				for key, value in data_dict.items():
					if "plant" in key:
						if not plant_module.registered(key):
							plant_module.register_sensor(key)
						sensor = plant_module.get_sensor(key)

					else:
						if not sensor_module.registered(key):
							sensor_module.register_sensor(key)
						sensor = sensor_module.get_sensor(key)

					# Upload data
					sensor.append_data(value)

				sensor_module.update_current_data()
				sensor_module.upload_data()
				sensor_module.check_data_and_notify()

				plant_module.update_current_data()
				plant_module.upload_data()
				plant_module.check_data_and_notify()

			request_timer = perf_counter()

		# Check if there has been any alerts sent
		# Alerts are important messages that need to be proccessed right away
		while ser.in_waiting:
			read_alerts(ser, intruder_module)

if __name__ == "__main__":
	index_main()
