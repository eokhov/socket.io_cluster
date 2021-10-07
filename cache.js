import { promisify } from 'node:util';
import redis from 'redis';

const client = redis.createClient({
  host: 'address',
  port: 6379
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
