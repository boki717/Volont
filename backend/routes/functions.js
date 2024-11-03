const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function tokenCheck(req, res, fail){
    const token = req.headers.authorization?.split(' ')[1];
    if (!token){
        res.status(401).json(fail);
    }
    else{
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (mongoose.Types.ObjectId.isValid(decoded.userId)){
                res.status(200);
                return decoded;
            }
            else{
                res.status(400).json(fail);
            }
        }
        catch (err){
            res.status(400).json(fail);
        }
    }
    return null;
}

module.exports = {
    tokenCheck,
};
