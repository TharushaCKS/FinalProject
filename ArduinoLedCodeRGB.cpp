// Define LED pins
#define RED_PIN 4
#define GREEN_PIN 3
#define BLUE_PIN 2

void setup() {
  // Start the serial communication
  Serial.begin(9600); 
  
  // Set LED pins as OUTPUT
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    Serial.println("Received: " + data);
    int r, g, b;
    if (sscanf(data.c_str(), "%d,%d,%d", &r, &g, &b) == 3) {
      Serial.print("Parsed R: "); Serial.println(r);
      Serial.print("Parsed G: "); Serial.println(g);
      Serial.print("Parsed B: "); Serial.println(b);
      analogWrite(RED_PIN, r);
      analogWrite(GREEN_PIN, g);
      analogWrite(BLUE_PIN, b);
      Serial.println("LED Color Updated");
    } else {
      Serial.println("Invalid Input");
    }
  }
}

//LED MATRIX

#include <LedControl.h>

// Initialize the LedControl library
LedControl lc = LedControl(12, 11, 10, 1); // Adjust the pin numbers according to your setup


//serial initilization for the led matrix
void setup() {
  Serial.begin(9600);
  lc.shutdown(0, false);
  lc.setIntensity(0, 8);
  lc.clearDisplay(0);
}

void loop() {
  if (Serial.available() > 0) { // open port
    String data = Serial.readStringUntil('\n'); //read the serial in 
    int bulb_number, state; 
    if (sscanf(data.c_str(), "%d,%d", &bulb_number, &state) == 2) {//data split into the bulb number and the state on or off
      int row = (bulb_number - 1) / 8; //we find specif row and column
      int col = (bulb_number - 1) % 8;
      lc.setLed(0, row, col, state); // turn it on
    }
  }
}
