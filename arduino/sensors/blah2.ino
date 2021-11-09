//The following is an arbitrary number of data points
  #define DATAPOINTS 10
  //The following is the number of iterations before we wipe the data
  #define DAILYITERATIONS 10
  //the following is the tolerance to change before the temperature/humidity is updated
  #define TOLERANCE 0.0
  //We will enter each datapoint into an array, and for the sake of demonstration,
  //We will call a random number generator


float storage[DATAPOINTS];
float moistureStorage[DATAPOINTS];
float moistureCounter = 0;
float counter = 0;
float pastAverages[DAILYITERATIONS] = {0};
float moisturePastAverage[DAILYITERATIONS] = {0};
int counter2 = 0;

float timer = 0;

float activeData[2];

char address = '2';

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
  timer = millis();
}

float readLight(){
  int data = analogRead(A0);
  return convertData(data);
}

float readMoisture(){
  int data = analogRead(A1);
  return convertData(data);
}

float convertData(float data){
  return (float)map(data, 1023, 0, 0, 100);
}
int i = 0;
void loop() {
  /*for (int i = 0; i < DATAPOINTS; i++){
    //storage[i] = generate(1);
    //Serial.println(storage[i]);
    storage[i] = readLight();
    delay(100);
    counter += storage[i];
  }*/

  if(millis() - timer > 100){
    timer = millis();
    storage[i] = readLight();
    moistureStorage[i] = readMoisture();
    counter += storage[i];
    moistureCounter += moistureStorage[i];
    i++;
  }

  if(i >= DATAPOINTS){
    i = 0;
    float average = counter / DATAPOINTS;
    float moistureAverage = moistureCounter / DATAPOINTS;
    //Serial.println("AVERAGE:");
    //Serial.println(average);
    pastAverages[counter2] = average;
    moisturePastAverage[counter2] = moistureAverage;
    if(counter2<DATAPOINTS){
      counter2 += 1; 
    }
    //Serial.println(counter2);
    counter = 0;
    moistureCounter = 0;
  }
    
  
  int flag = 0;
  int moistureFlag = 0;
  if (counter2 >= DATAPOINTS){
    for (int j = 1; j < 3; j++){
      if (abs(pastAverages[DATAPOINTS-1] - pastAverages[DATAPOINTS-1 - j]) >= TOLERANCE){
          flag = 1;
      }
      if (abs(moisturePastAverage[DATAPOINTS-1] - moisturePastAverage[DATAPOINTS-1 - j]) >= TOLERANCE){
          moistureFlag = 1;
      }
    }
    if (flag == 1){
      //Serial.println("Temperature: ");
      //Serial.println(pastAverages[counter2]);
      activeData[0] = pastAverages[DATAPOINTS-1];
      flag = 0;
    }

    if (moistureFlag == 1){
      //Serial.println("Temperature: ");
      //Serial.println(pastAverages[counter2]);
      activeData[1] = moisturePastAverage[DATAPOINTS-1];
      moistureFlag = 0;
    }
    counter2=0;
    
  }
  if(Serial.available()){
    char c = Serial.read();
    if(c == address){
      Serial.print("light/");
      Serial.print(activeData[0]);
      Serial.print("/moisture/");
      Serial.print(activeData[1]);
      Serial.print("\\\n\r");
    }
  }
}

float generate(int num){
  float randNumber = random(100);
  delay(100);
  return randNumber / 15.00 + 200.00 / 8.00;
}
