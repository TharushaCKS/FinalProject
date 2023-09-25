var SerialPort = require('serialport').SerialPort;
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library


const uri = 'mongodb+srv://tharushacao1:ng2HgSJv4CEHJTCF@lightdata.a5f3ekl.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = new SerialPort({ path: 'COM5', baudRate: 9600 });

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function storeColorData(lightId, r, g, b) {
    try {
        await client.connect();
        const database = client.db('mydatabase');
        const collection = database.collection('colorData');
        await collection.insertOne({ lightId, r, g, b, timestamp: new Date() });
        console.log('Color data stored in MongoDB');
    } catch (err) {
        console.error('Error storing color data:', err);
    } 
}

async function changeColor() {
    for (let i = 0; i < 10; i++) {
        const r = getRandomInt(0, 255);
        const g = getRandomInt(0, 255);
        const b = getRandomInt(0, 255);
        const lightId = uuidv4();
        const data = `${r},${g},${b}\n`;

        await new Promise(resolve => {
            port.write(data, function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
                console.log('Message written:', data);
                storeColorData(lightId, r, g, b);
                setTimeout(resolve, 2000); // Delay for 2 seconds 
            });
        });
    }
    port.close();
}

port.on('open', function() {
    console.log('Serial Port Opened');
    changeColor();
});
  
port.on('error', (err) => {
    console.log('Error: ', err.message);
});