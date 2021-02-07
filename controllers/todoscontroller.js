const todoModel = require('../models/Todo');
const asyncHandler = require('../middlewares/async');
const Todo = require('../models/Todo');
const response = require('../utils/errorResponse');
const { findByIdAndUpdate } = require('../models/Todo');

//@desc   Get all todos
//@route  Get /api/v1/todos
//@access Public
exports.getTodos = asyncHandler(async (req, res, next) => {
    const todos = await Todo.find();

    res.status(200).json({
        success: true,
        data: todos
    });
})

//@desc   Get single todo
//@route  Get/api/v1/todos:/:id
//@access Public
exports.getTodo = asyncHandler(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new response(`Todo not found with id of ${req.params.id}`), 404);
    }

    res.status(200).json({ success: true, data: todo });
});


//@desc   Create new todo
//@route  POST /api/v1/todos
//@access Public
exports.createTodo = asyncHandler(async (req, res, next) => {

    // Add user  to reqbody
    req.body.user = req.user.id;

    //check for published todos

    const publishTodo = await Todo.findOne({ user: req.user.id });

    //If the user is not an admin, they can only add one todo

    if (publishTodo) {//req.user.role !== 'admin'
        return next(new response(`The user with ID ${req.user.id} has already published a todo`, 400));
    }

    const todo = await Todo.create(req.body);

    res.status(201).json({
        success: true,
        data: todo
    });
});

//@desc  Delete todo
//@route DELETE /api/v1/bootcamps/:id
//@access Public
exports.deleteTodo = asyncHandler(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo)
        return next(new response(`Bootcamp not found with id of ${req.params.id}`, 404));

    //make sure user is todo owner
    if (todo.user.toString() !== req.user.id) {
        return next(new response(`Todo ${req.params.id} is not authorized to delete this todo`, 401));
    }

    todo.remove();
    res.status(200).json({ success: true, data: {} });
})

//@desc Update todo
//@route PUT /api/v1/todos/:id
//@access Public
exports.updateTodo = asyncHandler(async (req, res, next) => {

    try {
        console.log(req.params.id);
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return next(new response(`Todo not found with id of ${req.params.id}`, 404));
        }

        //make sure user is todo owner
        if (todo.user.toString() !== req.user.id) {
            return next(new response(`Todo ${req.params.id} is not authorized to update this todo`, 401));
        }

        todo = await findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        console.log(error.message);
    }
});
