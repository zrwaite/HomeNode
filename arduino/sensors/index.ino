void setup() {
Serial.begin(9600);
randomSeed(analogRead(0));

//The following is an arbitrary number of data points
#define DATAPOINTS 10

//We will enter each datapoint into an array, and for the sake of demonstration,
//We will call a random number generator
int storage[DATAPOINTS];
  for (int i = 0; i < DATAPOINTS; i++){
    storage[i] = generate(1);
    Serial.println(storage[i]);
  }

}

void loop() {

}

//random number generator
int generate(int num){
  int randNumber = random(100);
  delay(100);
  return randNumber;
}