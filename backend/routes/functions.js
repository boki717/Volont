const jwt = require('jsonwebtoken');

function tokenCheck(req, res, fail){
    const token = req.headers.authorization?.split(' ')[1];
    if (!token){
        res.status(401).json(fail);
    }
    else{
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.status(200);
            return decoded;
        }
        catch (err){
            res.status(400).json(fail);
        }
    }
}

module.exports = {
    tokenCheck,
};
