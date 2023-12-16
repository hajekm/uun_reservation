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
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth');
}

function isManager(req, res, next) {
    if (process.env.NODE_ENV === 'AuthOverride') {
        return next();
    }
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/auth');
    }

    if (req.user.role_id == 2) {
        return next();
    }
    return res.redirect('/');
}

function isAdmin(req, res, next) {
    if (process.env.NODE_ENV === 'AuthOverride') {
        return next();
    }
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/auth');
    }

    if (req.user.role_id == 1) {
        return next();
    }

    return res.redirect('/');
}

module.exports = { ensureAuthenticated, isAdmin, isManager };
