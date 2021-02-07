const mongoose = require('mongoose');

const connectDb = async () => {

    console.log(`mongo db is Port ${process.env.PORT}, ${process.env.MONGO_URI} starting...`.blue);
    var connection = process.env.MONGO_URI;

    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/TodoDb', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDb;