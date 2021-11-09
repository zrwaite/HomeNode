//The following is an arbitrary number of data points
#define DATAPOINTS 5
//The following is the number of iterations before we wipe the data
#define DAILYITERATIONS 10
//the following is the tolerance to change before the temperature/humidity is updated
#define TOLERANCE 0
//We will enter each datapoint into an array, and for the sake of demonstration,

#include "DHT.h"

#define DHTPIN 2 
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

float storage[DATAPOINTS];
float humidityStorage[DATAPOINTS];
float humidityCounter = 0;
float counter = 0;
float pastAverages[DAILYITERATIONS] = {0};
float humidityPastAverage[DAILYITERATIONS] = {0};
int counter2 = 0;

float timer = 0;

float activeData[2];
float pastActiveData[] = {0,0};

char address = '1';

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
  timer = millis();
  dht.begin();
}

float readDHT_Temperature(){
  float data = dht.readTemperature();
  return data;
}

float readDHT_Humidity(){
  float data = dht.readHumidity();
  return data;
}

float convertData(float data){
  return (float)map(data, 1023, 0, 0, 100);
}
int i = 0;
void loop() {

  // Check if it's time to read another datapoint
  // It takes about 250 ms to read the sensor, but the data can be up to
  // 2 seconds old accord to sensor specifications
  if(millis() - timer > 500){
    timer = millis();
    storage[i] = readDHT_Temperature();
    humidityStorage[i] = readDHT_Humidity();
    counter += storage[i];
    humidityCounter += humidityStorage[i];
    i++;
  }

  // Check if we have enough datapoints to make an average calculation
  if(i >= DATAPOINTS){
    i = 0;
    float average = counter / DATAPOINTS;
    float humidityAverage = humidityCounter / DATAPOINTS;
    //Serial.println("AVERAGE:");
    //Serial.println(average);
    pastAverages[counter2] = average;
    humidityPastAverage[counter2] = humidityAverage;
    if(counter2<DATAPOINTS){
      counter2 += 1; 
    }
    
    //Serial.println(counter2);
    counter = 0;
    humidityCounter = 0;
  }
    
  
  int flag = 0;
  int humidityFlag = 0;
  if (counter2 >= DATAPOINTS){
    for (int j = 1; j < 3; j++){
      if (abs(pastAverages[DATAPOINTS-1] - pastAverages[DATAPOINTS-1- j]) >= TOLERANCE){
          flag = 1;
      }
      if (abs(humidityPastAverage[DATAPOINTS-1] - humidityPastAverage[DATAPOINTS-1- j]) >= TOLERANCE){
          humidityFlag = 1;
      }
    }
    if (flag == 1){
      //Serial.println("Temperature: ");
      //Serial.println(pastAverages[counter2]);
      activeData[0] = pastAverages[DATAPOINTS-1];
    }
    /*for(int k = 0; k < DATAPOINTS; k++){
      Serial.print(k);
      Serial.print(" ");
      Serial.print(pastAverages[k]);
      Serial.print(" "); 
    }
    Serial.print("\n");*/
    if (humidityFlag == 1){
      //Serial.println("Temperature: ");
      //Serial.println(pastAverages[counter2]);
      activeData[1] = humidityPastAverage[DATAPOINTS-1];
    }
    counter2 =0;
  }
  if(Serial.available()){
    char c = Serial.read();
    if(c == address){
      Serial.print("temperature/");
      if(pastActiveData[0] != activeData[0]){
          Serial.print(activeData[0]); 
      }
      Serial.print("/humidity/");
      if(pastActiveData[1] != activeData[1]){
          Serial.print(activeData[1]); 
      }
      Serial.print("\\\n\r");
      pastActiveData[0] = activeData[0];
      pastActiveData[1] = activeData[1];
    }
  }
}
