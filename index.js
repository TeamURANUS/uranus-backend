const express = require("express");
const cors = require("cors");
const path = require("path");
const moment = require("moment-timezone");
const morgan = require("morgan");
const createError = require("http-errors");

const config = require("./utils/config");
const logger = require("./utils/logger");

const commentRoutes = require("./routes/commentRouter");
const userRoutes = require("./routes/userRouter");
const eventRoutes = require("./routes/eventRouter");
const authRoutes = require("./routes/authRouter");
const notificationRoutes = require("./routes/notificationRouter");
const postRoutes = require("./routes/postRouter");
const newsRoutes = require("./routes/newRouter");
const groupRoutes = require("./routes/groupRouter");

const app = express();

morgan.token("date", (req, res, tz) => {
  return moment().tz(tz).format("YYYY-MM-DD ZZ HH:mm:ss");
});

// app uses:
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    "[MORGAN]: :date[Europe/Istanbul]: :method :url - :status - :remote-addr :user-agent",
    {
      stream: logger.stream.write,
      skip: (req, res) => {
        if (process.env.NODE_ENV === "production") return res.statusCode < 400;
      },
    }
  )
);

app.use("/api/comments", commentRoutes.routes);
app.use("/api/users", userRoutes.routes);
app.use("/api/events", eventRoutes.routes);
app.use("/api/auth", authRoutes.routes);
app.use("/api/notifications", notificationRoutes.routes);
app.use("/api/posts", postRoutes.routes);
app.use("/api/news", newsRoutes.routes);
app.use("/api/groups", groupRoutes.routes);

app.get("/", function (req, res, next) {
  logger.info("Request to Home Route");
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

app.listen(parseInt(config.port), config.host, () =>
  console.log(`App is listening on ${config.host}:${config.port}`)
);

module.exports = app;
