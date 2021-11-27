// Hardcoded parameters
#define MEASURE_INTERVAL 100  // How long in milliseconds before the module checks sensors again
#define UPDATE_INTERVAL 5000  // How long in milliseconds before the modules sends a status update
#define SENSORS_NUM 3         // Number of sensors on the module
#define ADDRESS 3             // Address of the module

// Global data storage variables:

// Sensor data struct
typedef struct {
  int pin;              // Pin number of the sensor
  String tag;           // Id of the sensor
  bool detected;        // If the sensor has detected something
  bool locked_detected; // If the sensors has detected something but was locked
} IntrudersSensor;

IntrudersSensor PIR_sensor = {3, "intruders_motion", false, false};
IntrudersSensor IR_sensor = {4, "intruders_door", false, false};
IntrudersSensor reed_sensor = {5, "intruders_window", false, false};

IntrudersSensor *sensors[] = {&PIR_sensor, &IR_sensor, &reed_sensor};

float update_timer = 0; // Timer for sending data
float sensors_timer = 0; // Timer for reading sensors
const char address = ADDRESS; // Address of the module

// Lock character:    ~
// Unlock character:  &
bool locked = false;

void setup() {
  
  Serial.begin(9600);

  // Reset timers
  update_timer = millis();
  sensors_timer = update_timer;

  for(int i = 0; i < SENSORS_NUM; ++i){
    pinMode(sensors[i]->pin, INPUT);
  }
}

// Functions to read from sensors correctly,
// true only ever means that the sensor has detected something
float read_PIR(){ return digitalRead(PIR_sensor.pin); }
float read_IR(){ return !digitalRead(IR_sensor.pin); }
float read_reed(){ return digitalRead(reed_sensor.pin); }

void check_sensors(){
  // We save the fact the we detected something,
  // even if lasted only for a brief moment
  if(read_PIR()) { sensors[0]->detected = true; }
  if(read_IR())  { sensors[1]->detected = true; }
  if(read_reed()){ sensors[2]->detected = true; } 
}

void send_alerts(){
  // Construct a single message containing all sensor statuses
  String message = "";

  // Check all sensors
  for(int i = 0; i < SENSORS_NUM; ++i){
    message += sensors[i]->tag + "/"; // Append the sensor tag

    // Add the sensor's status
    if(sensors[i]->detected == true){
      message += "1";
      sensors[i]->detected = false;
    } else {
      message += "0";
    }

     message += "/";
  }

  message += "\\\n\r";

  // Send the message all at once as the Arduino has a slower clockspeed
  Serial.print(message);
}

void send_locked_alerts(){
  // Construct a single message containing all sensor statuses
  String message = "";

  // Check all sensors
  for(int i = 0; i < SENSORS_NUM; ++i){
    message += sensors[i]->tag + "/"; // Append the sensor tag

    // Add the sensor's status
    if(sensors[i]->locked_detected == true){
      message += "1";
      sensors[i]->locked_detected = false;
    } else {
      message += "0";
    }
  }

  message += "\\\n\r";

  // Send the message all at once as the Arduino has a slower clockspeed
  Serial.print(message);
}

void loop() {

  //Check sensors often
  if(millis() - sensors_timer > MEASURE_INTERVAL){
    check_sensors();
    sensors_timer = millis();
  }

  //Check if the sensors have detected something
  if(millis() - update_timer > UPDATE_INTERVAL){
    // If the module is not locked, send alerts
    if(!locked){
      send_alerts(); 
    } else {
      // Otherwise save the fact that we need to send an alert
      for(int i = 0; i < SENSORS_NUM; ++i){
        if(sensors[i]->detected) { sensors[i]->locked_detected = true; }
      }
    }
    update_timer = millis();
  }

  // Check for messages from RPi
  while(Serial.available()){
    char c = Serial.read();
    switch (c){
      case address:
        // Create the message
        String message = "";

        // Append all sensors tags with no data
        for(int i = 0; i < SENSORS_NUM; ++i){
          message += sensors[i]->tag + "//";
        }

        message[message.length() - 1] = '\\'; // Last character needs to be the end character
        message += "\n\r";
        
        Serial.print(message);
        break;
      case '~': // Lock character
        locked = true;
        break;
      case '&': // Unlock character
        locked = false;
        // Check for any alerts that got locked out
        send_locked_alerts();
        break;
      default:
        break;
    }
  }
}