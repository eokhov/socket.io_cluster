import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import { setupMaster, setupWorker } from '@socket.io/sticky';
import { setupPrimary, createAdapter } from '@socket.io/cluster-adapter';
import io from './worker.js';
import uidStore from './helpers/uidStore.js';

const numCPUs = cpus().length;

if(cluster.isPrimary) {
  console.log(`Master started. Pid: ${process.pid}`);

  const httpServer = http.createServer();
  setupMaster(httpServer, {
    loadBalancingMethod: 'least-connection',
  });
  setupPrimary();
  cluster.setupPrimary({
    serialization: 'advanced',
  });
  httpServer.listen(3000, () => {
    console.log('Cluster started', process.pid);
  });

  for(let i = 0; i < numCPUs-1; i++) {
    let {process: {pid}} = cluster.fork();
    console.log(`Worker started. Pid: ${pid}`);
  }

  cluster.on('exit', (worker, code) => {
    console.log(`Worker died! Pid: ${worker.process.pid}, Code: ${code}`);
    if (code === 0) {
      let {process: {pid}} = cluster.fork();
      console.log(`Worker restarted. Pid: ${pid}`);
    }
  });
}

if(cluster.isWorker) {
  io.adapter(createAdapter());
  setupWorker(io);
  
  io.on('connection', async (socket) => {
    console.log('Connect');
    await uidStore.save(socket.handshake.query.uid, socket.id);

    socket.on('send', async ({uid}) => {
      let sid = await uidStore.find(uid);
      io.to(sid).emit('hey', {message: 'echo message'});
    });
  });
}