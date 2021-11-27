// Hardcoded parameters
#define MEASURING_DATAPOINTS 5  // The amount of datapoints we take for a measurement
#define COMPARING_DATAPOINTS 5 // The amount of measurements we use to compare data for significance
#define MEASURING_INTERVAL 200  // Milliseconds between individual sensor readings
#define TOLERANCE 1.0           // Change in data before we deem in significant
#define ADDRESS '2'             // Address of the module
#define SENSORS_NUM 2           // Number of sensors on the module

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

Sensor Light_sensor = {A0, "plant_light_level", 0, 0, 0};
Sensor Moisture_sensor = {A1, "plant_moisture", 0, 0, 0};

Sensor *sensors[] = {&Light_sensor, &Moisture_sensor};

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
  init_array(Light_sensor.data, MEASURING_DATAPOINTS);
  init_array(Moisture_sensor.data, MEASURING_DATAPOINTS);
  init_array(Light_sensor.measurements, COMPARING_DATAPOINTS);
  init_array(Moisture_sensor.measurements, COMPARING_DATAPOINTS);
}

// Raw data from sensors are on a scale of 0-1024, which we convert to 0-100
float convertData(float data){
  return (float)map(data, 1023, 0, 0, 100);
}

// Functions for reading sensor data
float readLight() {
  return convertData(analogRead(Light_sensor.pin));
}

float readMoisture() {
  return convertData((analogRead(Moisture_sensor.pin) +
                      analogRead(Moisture_sensor.pin + 1) ) / 2);
}

void loop() {

  // Check if it is time to read from the sensors
  if(millis() - timer > MEASURING_INTERVAL){
    // Read sensors
    Light_sensor.data[data_counter] = readLight();
    Moisture_sensor.data[data_counter] = readMoisture();
    
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
              sensors[i]->active_data == 0.00){
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
      // Send data for all the sensors
      for(int i = 0; i < SENSORS_NUM; ++i){
        // Send sensor id
        Serial.print(sensors[i]->tag);
        Serial.print("/");

        // Check there is any data to be sent
        if(sensors[i]->active_data != sensors[i]->sent_data){
          Serial.print(sensors[i]->active_data);
          sensors[i]->sent_data = sensors[i]->active_data;
        }
      }

      Serial.print("\\\n\r");
      
    }
  }
}

// "plant_light_level"
// "plant_moisture"
// "watering"
// "light_switch"
