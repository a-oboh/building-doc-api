const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");
const dotenv = require('dotenv');
const errorHandler = require('./src/helpers/error_handler');

//import routes
const userRouter = require('./src/routes/user_router');

const app = express();

dotenv.config();

var port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MONGO DB CONNECTED');
}).catch(err => {
    console.log(`can't connect to database → ${err.message}`);
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(errorHandler);

//routes
app.use('/api/auth', userRouter);

app.get('/', (req, res) => {
    res.send("<h1>Building Doctor API v1.0!</h1>");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

module.exports = app;