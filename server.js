// Dependencies
const express = require('express');

// Developing environment variable port
const PORT = process.env.PORT || 3001;

// Application usage express
const app = express();

// Routes to route files
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Determine URL encoded & JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Host of public file
app.use(express.static('public'));

// Usage of apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Application listener and it commence the server
app.listen(PORT, () => {
    console.log(`API server present on port ${PORT}!`);
});