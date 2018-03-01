const net = require('net');
const uuidv4 = require('uuid/v4');
const logger = require('winston-color');

// Global user list
const users = {};

// Create a server and listen on port 50000
const server = net.createServer( (socket) => {
  
  
  // Keep a "user" list
  socket.id = uuidv4();
  users[socket.id] = socket;
  // Log a new "user" joined
  logger.info('Connection established from: %s:%s to %s', socket.remoteAddress , socket.remotePort, socket.localPort );
  // ... and great him :)
  socket.write(`Welcome '${socket.remoteAddress}:${socket.remotePort}' your connection id is: '${socket.id}!'`);

  // Register a listener for data
  socket.on('data', (data) => {
    logger.info(`${socket.id} sent a message.`)
    broadcast(socket, data);
  });

  // Register a listener for disconnections so we can keep the "user" list updated
  socket.on('end', () => {
    const disconnectedClient = socket.id;
    delete users[socket.id];
    logger.info(`${disconnectedClient} disconnected.`);
  });

}).listen( { port: 50000 }, () => {
  logger.info('Server listening:', server.address());
});

// Helper for broadcasting messages to all connected clients
const broadcast = (sender, data) => {
  const targetUsers = Object.values(users);
  targetUsers.forEach((aUser) => {
    if(aUser !== sender) { // Do not echo back!
      logger.info('Sending data to: %s', aUser.id);
      aUser.write(data); // Send the data over the socket!
    }
  });
};

