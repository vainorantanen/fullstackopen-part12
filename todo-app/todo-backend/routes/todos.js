const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  try {
    // Create the new todo
    const todo = await Todo.create({
      text: req.body.text,
      done: false,
    });

    // Increment the todo counter
    const addedTodosCount = await redis.incrementTodoCounterAsync();

    res.send({
      ...todo.toJSON(),
      added_todos: addedTodosCount, // Include the number of added todos in the response
    });
  } catch (error) {
    console.error('Error adding a new todo:', error);
    return res.status(500).send({ error: 'Error adding a new todo' });
  }
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;
  console.log(text, done)
  try {
    req.todo.text = text !== undefined ? text : req.todo.text;
    req.todo.done = done !== undefined ? done : req.todo.done;
    await req.todo.save();
    res.send(req.todo);
  } catch (err) {
    return res.status(500).send({ error: 'Error updating todo' });
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
