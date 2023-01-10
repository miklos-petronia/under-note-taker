// Dependency
const express = require('express');

// app usage express
const app = express();

// Developing environment variable port
const PORT = process.env.PORT || 3001;


// Querry express to develop a route for every file in the 'public' folder and provide it a '/' route
app.use(express.static('public'));
// Assembles express app to manoeuvre data parser, middle wear develop req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// routes to route files
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);


// Application listener - begings at the server
app.listen(PORT, () => {
    console.log(`Server available at localhost${PORT}`);
});