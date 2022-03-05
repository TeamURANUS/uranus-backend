const express = require('express');
const cors = require('cors');
const path = require("path");
const createError = require("http-errors");


const config = require('./config');
const commentRoutes = require('./routes/commentRouter');
const userRoutes = require('./routes/userRouter');
const eventRoutes = require('./routes/eventRouter');

const app = express();

// app uses:
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.use('/api/comments', commentRoutes.routes);
app.use('/api/users', userRoutes.routes);
app.use('/api/events', eventRoutes.routes);

app.get("/", function (req, res, next) {
    res.send("home page msg");
});

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log('App is listening on port ' + config.url));

module.exports = app;
