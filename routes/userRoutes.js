const router = require('express').Router();
const user  = require('../controllers/userControllers');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware.js');

router.route('/login')
    .post(catchAsync(user.login));
    
    
router.route('/register')
    .get((req, res) => {
        res.status(200).json({ 
            message: "Esta rota é utilizada para registrar um novo usuário. Por favor, envie uma requisição POST para este mesmo endereço com os dados do usuário (ex: username, email, password) no corpo (body) da requisição em formato JSON." 
        });
    })
    .post(catchAsync(user.register));


router.route('/logout')
    .get(catchAsync(user.logout));


router.route('/forgotpassword')
    .post(catchAsync(user.forgotPassword));


router.route('/resetpassword/:id/:token')
    .post(catchAsync(user.resetPassword));


router.route('/profile')
    .get(isLoggedIn,catchAsync(user.profile));

// Rota para redefinir a senha utilizando o token
router.route('/resetpassword/:token')
    .post(catchAsync(user.resetPassword));


module.exports = router;