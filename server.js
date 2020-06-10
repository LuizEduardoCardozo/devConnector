const express = require('express');

const connectDb = require('./config/db');

const PORT = process.env.port || 3001;

connectDb();

const app = express();

app.use(express.json({extended: true}));

app.use('/api/users', require('./routes/api/users.js'));
app.use('/api/auth', require('./routes/api/auth.js'));
app.use('/api/post', require('./routes/api/posts.js'));
app.use('/api/profile', require('./routes/api/profile.js'));

app.listen(PORT);
