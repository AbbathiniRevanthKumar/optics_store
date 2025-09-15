const controller = require('../../controllers/auth.controller');
const { authenticate } = require('../../middleware/authenticate');

const router = require('express').Router();

router.post('/register',controller.register);
router.post('/login',controller.login);
router.post('/refresh',controller.refresh);
router.post('/logout',authenticate,controller.logout);
router.get("/me",authenticate,controller.userDetails);

module.exports = router;