const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const commentRoutes = require('./routes/comment-routes');
const userRoutes = require('./routes/user-routes');
const eventRoutes = require('./routes/event-routes');

const app = express();

// app uses:
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/comment', commentRoutes.routes);
app.use('/api/user', userRoutes.routes);
app.use('/api/event', eventRoutes.routes);

app.listen(config.port, () => console.log('App is listening on port ' + config.url));