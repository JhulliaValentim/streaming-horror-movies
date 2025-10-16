const User = require('./models/userModel')
const jwt = require('jsonwebtoken');

module.exports.isLoggedIn = (req, res, next) => {
    let token;

    // 1. Procura pelo token no cabeçalho de autorização (padrão de API)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // 2. Se não encontrar no cabeçalho, procura nos cookies (padrão de navegador)
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // 3. Se o token não for encontrado em nenhum dos locais, envia erro
    if (!token) {
        return res.status(400).json({ message: 'no token' });
    }

    // 4. Se o token for encontrado, verifica-o
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        // Anexa os dados do usuário à requisição para uso futuro
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};


module.exports.isSubscribed = async (req, res, next) => {
    const token = req.signedCookies.jwt;
    if(token){
        const decoded = jwt.verify(token, `${process.env.SECRET}`);
        const user = await User.findById(decoded.id);
        if(user.subscription_status) next();
        else res.status(400).json('not subscribed');
    }
    else{
        res.status(400).json('no token');
    }
}

