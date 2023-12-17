module.exports = function mockAuthMiddleware(req, res, next) {
    req.user = {
        id: 1,
        username: 'Franta Motycka',
        email: 'franta.motycka@gmail.com',
        role_id: 1
    };
    next();
};