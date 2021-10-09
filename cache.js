import { promisify } from 'node:util';
import cfg from './helpers/config.js';
import redis from 'redis';

const client = redis.createClient({
  host: cfg.cache_host,
  port: cfg.cache_port,
});

client.on('error', (e) => {
  console.log(e);
});

client.on('connect', () => {
  console.log('Redis connect');
});

client.on('ready', () => {
  console.log('Redis ready');
});

const operations = {
  set: promisify(client.set).bind(client),
  get: promisify(client.get).bind(client),
  del: promisify(client.del).bind(client),
};

export default operations;
