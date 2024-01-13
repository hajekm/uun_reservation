function ensureAuthenticated(req, res, next) {
    if (process.env.NODE_ENV === 'AuthOverride') {
        req.user = {
            id: 1,
            username: 'Franta Motycka',
            email: 'franta.motycka@gmail.com',
            role_id: 1
        };
        return next();
    }

    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({error: 'User not authorized'});
    return;
}

function isManager(req, res, next) {
    if (process.env.NODE_ENV === 'AuthOverride') {
        return next();
    }
    if (!req.isAuthenticated()) {
        res.status(401).json({error: 'User not authorized'});
        return;
    }

    if (req.user.role_id == 2) {
        return next();
    }
    res.status(403).json({error: 'User does not have access rights'});
    return;
}

function isAdmin(req, res, next) {
    if (process.env.NODE_ENV === 'AuthOverride') {
        return next();
    }
    if (!req.isAuthenticated()) {
        res.status(401).json({error: 'User not authorized'});
        return;
    }

    if (req.user.role_id == 1) {
        return next();
    }

    res.status(403).json({error: 'User does not have access rights'});
    return;
}

module.exports = {ensureAuthenticated, isAdmin, isManager};
