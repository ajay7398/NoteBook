const router=require('express').Router();
const {loginController,signupController, Logout}=require('../controllers/auth.controller')


router.post('/login',loginController);
router.post('/signup',signupController);
router.post('/logout',Logout)
module.exports=router;