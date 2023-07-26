const express = require('express');
const router = express.Router();
const redis = require('../redis')

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* GET statistics data. */
router.get('/statistics', async (req, res) => {
  try {
    const addedTodosCount = await redis.getAsync('added_todos');
    const statistics = {
      added_todos: parseInt(addedTodosCount) || 0,
    };
    res.send(statistics);
  } catch (error) {
    console.error('Error retrieving statistics:', error);
    return res.status(500).send({ error: 'Error retrieving statistics' });
  }
});

module.exports = router;
