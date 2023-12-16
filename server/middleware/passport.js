const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const config = require('../config/config');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret,
            callbackURL: config.googleAuth.callbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    where: {email: profile.emails[0].value}
                });

                if (!user) {
                    user = await User.create({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        role_id: 3
                    });
                }

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};