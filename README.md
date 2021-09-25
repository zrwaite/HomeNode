# Dreem Teem SE101 Project: Bootleg Smarthome
*This is the Github Repo for my group's final project in SE101.*
*Zac Waite, George Shao, Stephen Gong, Hargun Mujral, Michael Dennisov*

---

Our idea is to create a smart home system to monitor and control many different factors of home living, automating where possible. We will have a series of hardware modules with arduinos, such as a plant watering module, a motion sensor module, and a module for tracking temperature, humidity, etc. Each module will compile the results, and send them to a central raspberry pi, which will process the data and send it to our API. On the user end, we will have a website that will allow users to monitor the sensors at their home remotely.

---

## Software Components
* Arduino C++: Each module will need to pull input data from the sensors, track changes, make output decisions, and send the compiled data to the raspberry pi.
* Raspberry Pi Python: Reads input from all of the arduino modules, compiles the data into different http requests, and sends information to the server. 
* Node.js Server: Hosts a server and listens for incoming requests from the raspberry pi to send data to a mongo database, or requests from users to pull information.
* React Website: A visual interface for a user to view information about their smart home, with information pulled from the server. 

---

## Hardware Components
* Sensor Modules: Pull input data from the sensors, track changes, compile the data and send it to the central raspberry pi.
* Motion Module: Pull input data and determine if motion has been detected, then track, compile and send data. 
* Plant Module: Pull input data, determine if the plant needs to be watered, output commands to water the plant, then track, compile and send data. 

---

## Prototype Plan
* Create hardware that can read environmental data and compile it into meaningful info
* Create a central RPi router that can read all the data at once and output it to the server
* Create a server to host all of the post and get endpoints for accessing the home data
* Create a website UI for reading all of the data in an intuitive way.

--- 

## Challenges
* Understanding information from analog and digital sensor data (Parsing what the sensor data means, then reducing large amounts of data)
* Creating python code to read serial data from arduinos asynchronously 
* Creating efficient ways to maintain accurate, up to date information without too much electricity or too many online data transfers. 
* Creating and printing 3d models for discrete, simple, and functional hardware modules

