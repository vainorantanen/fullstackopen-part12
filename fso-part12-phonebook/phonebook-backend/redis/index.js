const redis = require('redis')
const { promisify } = require('util')
const { REDIS_URL } = require('../util/config')

let getAsync
let setAsync

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log('No REDIS_URL set, Redis is disabled')
    return null
  }
  getAsync = redisIsDisabled
  setAsync = redisIsDisabled
} else {
  const client = redis.createClient({
    url: REDIS_URL
  })
    
  getAsync = promisify(client.get).bind(client)
  setAsync = promisify(client.set).bind(client)    
}

const incrementPersonCounterAsync = async () => {
  try {
    const currentCount = await getAsync('added_persons');
    const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
    await setAsync('added_persons', newCount);
    return newCount;
  } catch (error) {
    console.error('Error incrementing the person counter:', error);
    throw error;
  }
};

module.exports = {
  getAsync,
  setAsync,
  incrementPersonCounterAsync
}