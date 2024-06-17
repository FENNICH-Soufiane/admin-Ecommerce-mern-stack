const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }
    console.log(req.header('Authorization'))

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verified);
        req.user = verified; // Store the user information in the request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token " });
    }
};


// Middleware to check if user is an admin
const verifyTokenAndAuthorization = (req, res, next) => {

    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "Access Denied: Admins only" });
        }
    })
}

// verify token admin
const verifyTokenAndAdmin = (req, res, next) => {

    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "Access Denied: Admins only" });
        }
    })
}


module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };