void setup() {
Serial.begin(9600);

randomSeed(analogRead(0));

}

void loop() {
  randNumber = random(100);
  Serial.println(randNumber);
  delay(50);
}