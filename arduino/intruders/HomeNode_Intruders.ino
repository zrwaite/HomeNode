float update_timer = 0; // Timer for sending data
float sensors_timer = 0; // Timer for reading sensors

const char address = '3';

typedef struct {
  int pin; // Pin number of the sensor
  bool detected; // If the sensor has detected something
  bool locked_detected; // If the sensors has detected something but was locked
} IntrudersSensor;

IntrudersSensor PIR_sensor = {3, false, false};
IntrudersSensor IR_sensor = {4, false, false};
IntrudersSensor reed_sensor = {5, false, false};

// Lock character:    ~
// Unlock character:  &
bool locked = false;

void setup() {
  
  Serial.begin(9600);

  // Reset timers
  update_timer = millis();
  sensors_timer = update_timer;
  
  pinMode(PIR_sensor.pin, INPUT);
  pinMode(IR_sensor.pin, INPUT);
  pinMode(reed_sensor.pin, INPUT);
}

// Functions to read from sensors correctly,
// true only ever means that the sensor has detected something
float read_PIR(){ return digitalRead(PIR_sensor.pin); }
float read_IR(){ return !digitalRead(IR_sensor.pin); }
float read_reed(){ return digitalRead(reed_sensor.pin); }

void check_sensors(){
  // We save the fact the we detected something,
  // even if lasted only for a brief moment
  if(read_PIR()) { PIR_sensor.detected = true; }
  if(read_IR())  { IR_sensor.detected = true; }
  if(read_reed()){ reed_sensor.detected = true; } 
}

void send_alerts(){
  // Send a separate message for every alert
  if(PIR_sensor.detected){
    Serial.print("intruders_PIR/1");
    Serial.print("\\\n\r");
    PIR_sensor.detected = false;
  }
  if(IR_sensor.detected){
    Serial.print("intruders_IR/1");
    Serial.print("\\\n\r");
    IR_sensor.detected = false;
  }
  if(reed_sensor.detected){
    Serial.print("intruders_reed/1");
    Serial.print("\\\n\r");
    reed_sensor.detected = false;
  }
}

void send_locked_alerts(){
  // Send a separate message for every locked alert
  if(PIR_sensor.locked_detected){
    Serial.print("intruders_PIR/1");
    Serial.print("\\\n\r");
    PIR_sensor.locked_detected = false;
  }
  if(IR_sensor.detected){
    Serial.print("intruders_IR/1");
    Serial.print("\\\n\r");
    IR_sensor.locked_detected = false;
  }
  if(reed_sensor.detected){
    Serial.print("intruders_reed/1");
    Serial.print("\\\n\r");
    reed_sensor.locked_detected = false;
  }
}

void loop() {

  //Check sensors often
  if(millis() - sensors_timer > 50){
    check_sensors();
    sensors_timer = millis();
  }

  //Check if the sensors have detected something
  if(millis() - update_timer > 2000){
    // If the module is not locked, send alerts
    if(!locked){
      send_alerts(); 
    } else {
      // Otherwise save the fact that we need to send an alert
      if(PIR_sensor.detected) { PIR_sensor.locked_detected = true; }
      if(IR_sensor.detected) { IR_sensor.locked_detected = true; }
      if(reed_sensor.detected){ reed_sensor.locked_detected = true; }
    }
    update_timer = millis();
  }

  // Check for messages from RPi
  while(Serial.available()){
    char c = Serial.read();
    switch (c){
      case address:
        Serial.print("intruders_PIR/");
        Serial.print("/intruders_IR/");
        Serial.print("/intruders_reed/");
        Serial.print("\\\n\r");
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
