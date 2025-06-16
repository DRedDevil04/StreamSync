const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require("./config/dbConfig");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require('./router.js');
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});