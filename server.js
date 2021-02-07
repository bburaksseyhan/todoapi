const express = require('express');
const dotenvironment = require('dotenv');
const morgan = require('morgan');
const color = require('colors');
const connectDb = require('./config/database');
const logger = require('./middlewares/logger');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const app = express();

//route configurations
const todoRoutes = require('./routes/todoRouter');
const authRoutes = require('./routes/authRouter');

//load environment variables
dotenvironment.config({ path: './config/config.env' });

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

connectDb();

app.use(logger);

//json body parse required
app.use(express.json());

//cookie parser
app.use(cookieParser());

//sanatize prevent NoSQL injection
app.use(mongoSanitize());

//set secure headers
app.use(helmet());

//prevent xss attacks
app.use(xssClean());

//rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000
});

// only apply to requests that begin with /api/
app.use(apiLimiter);
//Prevent hpp param pollution
app.use(hpp());


//enable cors
app.use(cors());

//routes
app.use('/api/v1/todos/', todoRoutes);
app.use('/api/v1/auth/', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold));


process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`.red);
    server.close(() => process.exit(1));
});