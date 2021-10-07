import http from 'node:http';
import { Server } from 'socket.io';

const httpServer = http.createServer();
const io = new Server(httpServer);

process.on('SIGINT', () => {
  // if you stop manually
  console.log('Close by SIGINT', process.pid);
  io.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  // If the process crashed with an error
  console.log('Close by SIGTERM');
  io.close(() => {
    process.exit(0);
  });
});

process.on('SIGUSR2', () => {
  // If you stopped the process by sending a signal <kill -s SIGUSR2 pid>
  io.close(() => {
    process.exit(1);
  });
});

export default io;
