const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const commentRoutes = require('./routes/comment-routes');

const app = express();

// app uses:
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', commentRoutes.routes);

app.listen(config.port, () => console.log('App is listening on port ' + config.url));