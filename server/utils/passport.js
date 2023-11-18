const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: "clientId",
        clientSecret: "clientSecret",
        callbackURL: '/auth/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                let user = {
                    id: profile.id, 
                    displayName: profile.displayName,
                    email: profile.emails[0].value
                }
                /*let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.email
                        // Další informace podle potøeby
                    });
                }*/

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        /*User.findById(id, (err, user) => {
            done(err, user);
        });*/

        done(null, user); 
    });
};