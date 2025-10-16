const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

module.exports.login = async (req, res) => {
    let { email, password } = req.body;
    if(!email || !password) res.status(400).json('missing fields');
    else{
        email = email.toLowerCase();
        const user = await User.findOne({ email: email});
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user._id }, `${process.env.SECRET}`, { expiresIn: '1h' });
            res.status(200).json({ token: token, message: 'Login bem-sucedido!' });
        } 
        else {
            res.status(400).json('login failed');
        }
    }
}



module.exports.register = async (req, res) => {
    let { username, email, password } = req.body;
    email = email.toLowerCase();
    const registeredEmail = await User.findOne({email: email});

    if(registeredEmail){
        res.status(400).json('email already exists');
    }

    else{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        await User.create({username, email, password: hash});
        res.json('register');
    }
}


module.exports.logout = (req, res) => {
    res.clearCookie('jwt').json('logout');
};


module.exports.profile = async (req, res) => {
    const token = req.signedCookies.jwt;
    if(token){
        const decoded = jwt.verify(token, `${process.env.SECRET}`);
        const user = await User.findById(decoded.id);
        res.json(user);
    }
    else{
        res.status(400).json('no token');
    }
}


module.exports.forgotPassword = async (req, res, next) => {
    // 1. Encontrar o usuário pelo email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        // Nota de segurança: Não revele que o usuário não existe.
        // Apenas dizemos que o email foi enviado se o usuário existir.
        return res.status(200).json({ message: 'Um email foi enviado com as instruções para redefinir a senha.' });
    }

    // 2. Gerar um token aleatório
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 3. Salvar o token e a data de expiração no usuário
    user.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expira em 10 minutos
    await user.save({ validateBeforeSave: false });

    // 4. Criar a URL de reset
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;

    // 5. Enviar o email
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"Netflix API Clone" <noreply@netflixclone.com>',
            to: user.email,
            subject: 'Redefinição de Senha',
            text: `Você solicitou a redefinição da sua senha. Por favor, clique no seguinte link, ou cole no seu navegador para completar o processo: \n\n ${resetURL}`
        });

        res.status(200).json({ message: 'Um email foi enviado com as instruções para redefinir a senha.' });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        console.error('ERRO AO ENVIAR EMAIL:', err);
        return res.status(500).json({ message: 'Houve um erro ao enviar o email. Tente novamente mais tarde.' });
    }
};


module.exports.resetPassword = async (req, res, next) => {
    // 1. Obter o token da URL e criar o hash para procurar no DB
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // 2. Encontrar o usuário pelo token e verificar se o token não expirou
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() } // $gt = greater than (maior que)
    });

    // 3. Se o token for inválido ou tiver expirado, enviar um erro
    if (!user) {
        return res.status(400).json({ message: 'Token é inválido ou expirou.' });
    }

    // 4. Se o token for válido, definir a nova senha
    user.password = req.body.password;
    // Limpar os campos de reset do usuário
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // O middleware 'pre-save' no seu userModel irá fazer o hash da nova senha automaticamente
    await user.save();

    // 5. Enviar resposta de sucesso
    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
};
