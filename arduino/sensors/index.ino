void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));

  //The following is an arbitrary number of data points
  #define DATAPOINTS 10

  //the following is the tolerance to change before the temperature/humidity is updated
  #define TOLERANCE 1

  //We will enter each datapoint into an array, and for the sake of demonstration,
  //We will call a random number generator
Serial.println(abs(-12));

}

void loop() {

  float storage[DATAPOINTS];
  float counter = 0;
  int currentTime = millis();

  for (int i = 0; i < DATAPOINTS; i++){
    storage[i] = generate(1);
    Serial.println(storage[i]);
    counter += storage[i];
  }

  float average = counter / DATAPOINTS;
  Serial.println("AVERAGE:");
  Serial.println(average);
  delay(6000);

  Serial.println(deltaTime(currentTime));
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
}

//random number generator
float generate(int num){
  float randNumber = random(100);
  delay(100);
  return randNumber / 15.00 + 200.00 / 8.00;
}

bool tolerant(int current_average, int data){
  if (abs(data - current_average) < TOLERANCE){
    return true;
  }
  return false;
}

int deltaTime(int currentTime){
  return millis() - currentTime;
}