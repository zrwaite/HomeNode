  //The following is an arbitrary number of data points
  #define DATAPOINTS 10
  //The following is the number of iterations before we wipe the data
  #define DAILYITERATIONS 240
  //the following is the tolerance to change before the temperature/humidity is updated
  #define TOLERANCE 1
  //We will enter each datapoint into an array, and for the sake of demonstration,
  //We will call a random number generator


float storage[DATAPOINTS];
float counter = 0;
float pastAverages[DAILYITERATIONS] = {0};
int counter2 = 0;

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
}
void loop() {
  for (int i = 0; i < DATAPOINTS; i++){
      storage[i] = generate(1);
      //Serial.println(storage[i]);
      counter += storage[i];
    }

    float average = counter / DATAPOINTS;
    Serial.println("AVERAGE:");
    Serial.println(average);
    pastAverages[counter2] = average;
  
  int flag = 0;
  if (counter2 > 6){
    for (int i = 1; i < 3; i++){
      if (abs(pastAverages[counter2] - pastAverages[counter2 - i]) >= TOLERANCE){
          flag = 1;
      }
    }
  }
  if (flag == 1){
    Serial.println("Temperature: ");
    Serial.println(pastAverages[counter2]);
  }
    counter2 += 1;
    counter = 0;
}

float generate(int num){
  float randNumber = random(100);
  delay(100);
  return randNumber / 15.00 + 200.00 / 8.00;
}





//NOTES


//use the sensor every 6 seconds and store temperature / humidity as a datapoint
//once there are 10 datapoints, compute average

//We must first include in the loop to check the last 5 displayed temperatures and
//and whether its displayAverage5 is within TOLERANCE of the average. If so, keep the displayed
//temperature the same and wipe the data points

//else{

  //if abs(average - oldaverage) >= TOLERANCE
    // oldAverage = average
    // return oldAverage to the display

  //else
    //for (int i = 0; i < DATAPOINTS; i++){
      //storage[i] = 0;
    //}
  // We will keep the displayed temperature the same while it isn't updated
//}

//random number generator