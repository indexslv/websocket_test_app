import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [password, setPassword] = useState('');
  const [containers, setContainers] = useState([]);

  // Initialize socket within the component
  const socket = io('wss://localhost:4000', { secure: true, reconnect: true, rejectUnauthorized: false });

  useEffect(() => {
    socket.on('updateContainers', (updatedContainers) => {
      setContainers(updatedContainers);
    });

    return () => {
      socket.off('updateContainers');
    };
  }, [socket]);

  const handleStart = () => {
    socket.emit('startContainer', { ip, port, password });
  };

  const handleUpdate = (containerId) => {
    socket.emit('updateContainer', { id: containerId, ip, port, password });
  };

  const handleStop = (containerId) => {
    socket.emit('stopContainer', { id: containerId });
  };

  const handleSuspend = (containerId) => {
    socket.emit('suspendContainer', { id: containerId });
  };

  const handleDelete = (containerId) => {
    socket.emit('deleteContainer', { id: containerId });
  };

  return (
    <div>
      <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="IP Address" />
      <input value={port} onChange={(e) => setPort(e.target.value)} placeholder="Port" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleStart}>Start Container</button>

      <h3>Containers</h3>
      <ul>
        {containers.map((container) => (
          <li key={container.id}>
            {container.ip}:{container.port} - {container.status}
            <button onClick={() => handleUpdate(container.id)}>Update</button>
            <button onClick={() => handleStop(container.id)}>Stop</button>
            <button onClick={() => handleSuspend(container.id)}>Suspend</button>
            <button onClick={() => handleDelete(container.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
