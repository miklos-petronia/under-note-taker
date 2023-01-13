//Dependencies
const router = require('express').Router();
const notesRoutes = require('./notesRoutes');
//Routing
router.use(notesRoutes);

module.exports = router;