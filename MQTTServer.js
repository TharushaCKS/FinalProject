
const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on('connect', function () {
    setInterval(() => {
        for (let bulbId = 1; bulbId <= 10; bulbId++) {
            // Generate random RGB values
            const r = 222
            const g = 3
            const b = 2
            
            // Create the topic and message
            const topic = `bulbs/${bulbId}/colorChanged`;
            const message = JSON.stringify({ r, g, b });
            
            // Publish the message to the topic
            client.publish(topic, message);
            console.log(`Published to ${topic}: ${message}`);
        }
    }, 1000); // Change color of 10 bulbs every second
});
