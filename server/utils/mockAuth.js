module.exports = function mockAuthMiddleware(req, res, next) {
    req.user = {
        username: 'Franta Motycka',
        email: 'franta.motycka@gmail.com',
        role_id: 1
    };
    next();
};