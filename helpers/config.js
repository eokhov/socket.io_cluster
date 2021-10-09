import {config} from 'dotenv';
const cfg = config();

if (cfg.error) {
  console.log('Error parsing env variables', cfg.error);
}

export default {
  app_port: process.env.APP_PORT,
  cache_host: process.env.CACHE_HOST,
  cache_port: process.env.CACHE_PORT,
};
