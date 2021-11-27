// Hardcoded parameters
#define MEASURING_DATAPOINTS 5  // The amount of datapoints we take for a measurement
#define COMPARING_DATAPOINTS 5 // The amount of measurements we use to compare data for significance
#define MEASURING_INTERVAL 200  // Milliseconds between individual sensor readings
#define TOLERANCE 1.0           // Change in data before we deem in significant
#define ADDRESS '1'             // Address of the module
#define SENSORS_NUM 2           // Number of sensors on the module

// DHT specific parameters
#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// Global data storage variables:

// Sensor data struct
typedef struct {
  int pin;                                  // Pin of the sensor
  String tag;                               // Id of the sensor
  int significant_flag;                     // If the current data is significant
  float active_data;                        // Data that is to be sent
  float sent_data;                          // Data that was sent
  float data[MEASURING_DATAPOINTS];         // Current data for a measurement
  float measurements[COMPARING_DATAPOINTS]; // Past measurements
} Sensor;

// No pins defined because the DHT sensor sends packets of information to a single port
Sensor Temperature_sensor = {-1, "temperature", 0, 0, 0};
Sensor Humidity_sensor = {-1, "humidity", 0, 0, 0};

Sensor *sensors[] = {&Temperature_sensor, &Humidity_sensor};

int data_counter = 0;       // Counter for amount of datapoints read
int measurement_counter = 0;// Counter for amount of measurements measured
float timer = 0;            // Timer used for measruing interval
char address = ADDRESS;     // Address of the module

void init_array(float arr[], int len){
  for(int i = 0; i < len; ++i){
    arr[i] = 0;
  }
}

// Setup function
void setup() {
  Serial.begin(9600);
  timer = millis();

  // Initialize all the data arrays
  init_array(Temperature_sensor.data, MEASURING_DATAPOINTS);
  init_array(Humidity_sensor.data, MEASURING_DATAPOINTS);
  init_array(Temperature_sensor.measurements, COMPARING_DATAPOINTS);
  init_array(Humidity_sensor.measurements, COMPARING_DATAPOINTS);

  // Initialize sensor pins
  dht.begin();
}

// Raw data from sensors are on a scale of 0-1024, which we convert to 0-100
// Not used by DHT sensors
float convertData(float data){
  return (float)map(data, 1023, 0, 0, 100);
}

// Functions for reading sensor data
float readTemp() {
  return dht.readTemperature();
}

float readHumid() {
  return dht.readHumidity();
}

void loop() {

  // Check if it is time to read from the sensors
  if(millis() - timer > MEASURING_INTERVAL){
    // Read sensors
    Temperature_sensor.data[data_counter] = readTemp();
    Humidity_sensor.data[data_counter] = readHumid();
    
    data_counter++;
    
    timer = millis();

    // Check if we have enough datapoints to make a measurement
    if(data_counter == COMPARING_DATAPOINTS){
      data_counter = 0; // Reset datapoint counter
  
      // Calculate the average of the datapoints and store it as a measurement
      for(int i = 0; i < SENSORS_NUM; ++i){
        float avg = 0.0;
  
        // Calculate the average
        for(int j = 0; j < MEASURING_DATAPOINTS; ++j){
          avg += sensors[i]->data[j];
        }
        avg /= MEASURING_DATAPOINTS;
  
        // Store the average
        sensors[i]->measurements[measurement_counter] = avg;
      }
      
      measurement_counter++;
    }
  
    // Check if we have enough measurements to see if our 
    if(measurement_counter == COMPARING_DATAPOINTS){
      measurement_counter = 0; // Reset measurement counter
  
      int current_measurement = COMPARING_DATAPOINTS - 1;
  
      // Check all the sensors
      for(int i = 0; i < SENSORS_NUM; ++i){
  
        // Check all the sensors for significant measurements
        for(int j = 0; j < COMPARING_DATAPOINTS; ++j){
          if(abs(sensors[i]->measurements[current_measurement] - 
              sensors[i]->measurements[current_measurement-j]) >= TOLERANCE ||
              abs(sensors[i]->measurements[current_measurement] - 
              sensors[i]->active_data) >= TOLERANCE){
            // The current datapoint is significant
            sensors[i]->significant_flag = 1;
            break;
          }
        }
        
        // Check if there was significant data
        if(sensors[i]->significant_flag == 1){
          sensors[i]->significant_flag = 0;
          sensors[i]->active_data = sensors[i]->measurements[current_measurement];
        }
      }
    }
  }

  // Check if there is a data request
  if(Serial.available()){
    char c = Serial.read();

    if(c == address){
      // Create the message
      String message = "";
      
      for(int i = 0; i < SENSORS_NUM; ++i){
        // Send sensor id
        message += sensors[i]->tag + "/";

        // Check there is any data to be sent
        if(sensors[i]->active_data != sensors[i]->sent_data){
          String active_data = String(sensors[i]->active_data, 2);
          message += active_data;
          sensors[i]->sent_data = sensors[i]->active_data;
        }
        message += "/";
      }

      message[message.length() - 1] = '\\'; // Last character needs to be the end character
      message += "\n\r";

      Serial.print(message);
    }
  }
}