const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.error('Database connection error:', err);
});