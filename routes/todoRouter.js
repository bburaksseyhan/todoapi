const express = require('express');
const {
    getTodos,
    getTodo,
    createTodo,
    deleteTodo,
    updateTodo
} = require('../controllers/todoscontroller');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.route('/')
      .get(protect, getTodos)
      .post(protect ,createTodo);

router.route('/:id')
      .get(protect, getTodo)
      .put(protect, updateTodo)
      .delete(protect, deleteTodo);

module.exports = router;