const WebSocket = require('ws');

// Create a new WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('Server started on port 8080...');

wss.on('connection', ws => {
    console.log('New client connected!');

    // When a message is received from a client
    ws.on('message', message => {
        console.log(`Received message: ${message}`);

        // Broadcast the message to all clients, including the sender
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    // When a client disconnects
    ws.on('close', () => {
        console.log('Client has disconnected.');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});