const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// Store bulb color data
const bulbColorData = {};

client.on('connect', function () {
  // Subscribe to all needed topics in MQTT
  for (let bulbId = 1; bulbId <= 10; bulbId++) {
    client.subscribe(`bulbs/${bulbId}/colorChanged`);
  }
});

client.on('message', function (topic, message) {
  console.log(`Received message from ${topic}: ${message.toString()}`);
  
  const [_, bulbId] = topic.split('/');
  
  // Parse the received message to get RGB values
  const { r, g, b } = JSON.parse(message);
  
  // Store the color data for the bulb
  bulbColorData[bulbId] = {
    r,
    g,
    b,
    timestamp: Date.now()
  };
  
  // Check for alerts
  checkForAlerts(bulbId);
});

function checkForAlerts(bulbId) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  // 1. Check if the bulb is on after 11pm
  if (currentHour >= 23 && (bulbColorData[bulbId].r > 0 || bulbColorData[bulbId].g > 0 || bulbColorData[bulbId].b > 0)) {
    console.log(`Alert: Bulb ${bulbId} is on after office hours!`);
  }
  
  // 2. Check if the RGB values for the bulb are > 0 for more than 10 seconds
  if (currentTime.getTime() - bulbColorData[bulbId].timestamp > 10000) {
    console.log(`Alert: Bulb ${bulbId} has been on with RGB values > 0 for more than 10 seconds!`);
  }
}
