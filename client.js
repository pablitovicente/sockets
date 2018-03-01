const net = require('net');
const logger = require('winston-color');
const loremIpsum = require('lorem-ipsum');

const client = new net.Socket();

client.connect(50000, '127.0.0.1', () => {
	logger.info('Connected to server');
});

client.on('error', (error) => {
  logger.error(error);
  process.exit();
});

client.on('close', () => {
	console.log('Connection closed by server');
});

client.on('data', (data) => {
	logger.info(data.toString()); // data is a buffer so string it!
});

setInterval(() => {
  const chitchat = loremIpsum({
    count: 1, 
    units: 'sentences',
    sentenceLowerBound: 5,
    sentenceUpperBound: 10,
    format: 'plain'
  });
  client.write(chitchat);
}, 50);

