import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import { setupMaster, setupWorker } from '@socket.io/sticky';
import { setupPrimary, createAdapter } from '@socket.io/cluster-adapter';
import io from './worker.js';
import cfg from './helpers/config.js';

import loginHandler from './handlers/login.js';

const numCPUs = cpus().length;

if(cluster.isPrimary) {
  const httpServer = http.createServer();
  setupMaster(httpServer, {
    loadBalancingMethod: 'least-connection',
  });
  setupPrimary();
  cluster.setupPrimary({
    serialization: 'advanced',
  });
  httpServer.listen(cfg.app_port, () => {
    console.log(`Cluster started. Pid: ${process.pid}`);
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

  const onConnetion = (socket) => {
    loginHandler(io, socket);
  };
  
  io.on('connection', onConnetion);
}
