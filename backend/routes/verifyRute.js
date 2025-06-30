const verifyUser =require('../controllers/verify.controller')
const router=require('express').Router();
router.get("/verify",verifyUser);
module.exports=router