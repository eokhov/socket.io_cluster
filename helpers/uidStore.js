import cache from '../cache.js';

export default {
  save(key, data) {
    return cache.set(key, data);
  },
  find(key) {
    return cache.get(key);
  }
};
