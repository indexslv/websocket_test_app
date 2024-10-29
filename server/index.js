const express = require('express');
const https = require('https');
const fs = require('fs');
const mariadb = require('mariadb');
const { Server } = require('socket.io');
const Docker = require('dockerode');
const docker = new Docker();

const pool = mariadb.createPool({
  host: 'mariadb', // container name in docker-compose.yml
  user: 'root',
  password: 'your_password',
  database: 'docker_management',
});

const app = express();
const server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
}, app);

const io = new Server(server, { secure: true });

io.on('connection', (socket) => {
    socket.on('startContainer', async ({ ip, port, password }) => {
      console.log('Received startContainer event with:', { ip, port, password }); // Log incoming data
      
      try {
        const container = await docker.createContainer({
          Image: 'node:latest',
          Cmd: ['node', '-e', `console.log('IP: ${ip}, Port: ${port}, Password: ${password}')`],
          ExposedPorts: { [`${port}/tcp`]: {} },
        });
  
        await container.start();
  
        const containerData = { id: container.id, ip, port, password, status: 'running' };
        await saveContainerData(containerData);
  
        // Emit back to the frontend
        io.emit('updateContainers', containerData);
      } catch (error) {
        console.error('Error creating container:', error);
      }
    });
  
    // Other events...
  });
  

async function saveContainerData(container) {
  const conn = await pool.getConnection();
  await conn.query('INSERT INTO containers VALUES (?, ?, ?, ?, ?)', [
    container.id,
    container.ip,
    container.port,
    container.password,
    container.status,
  ]);
  conn.release();
}

server.listen(4000, () => {
  console.log('Secure WebSocket server running on port 4000');
});
