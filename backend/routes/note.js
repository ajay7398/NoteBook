const { createNote } = require('../controllers/auth.controller');
const { fetchNote, removeNote, updateNote, markNote } = require('../controllers/note.controller');
const verifyToken = require('../middlewares/auth.middleware.js')
const router=require('express').Router();

router.get('/fetch',verifyToken,fetchNote);
router.post('/delete',removeNote);
router.post('/update',updateNote);
router.post('/mark',markNote);
router.post('/save',verifyToken,createNote);

module.exports=router

