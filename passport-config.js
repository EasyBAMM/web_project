const { Strategy, authenticate } = require('passport');
const LocalStartegy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


function initialize(passport) {
    const authenticateUser = async (password, done) => {
        const user = getUserByPassword(password)
        if (user == null) {
            return done(null, false, {message: "No user with that password"});
        }

        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Password incorrect"})
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStartegy({usernameField: 'email'}), authenticateUser)

    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})
}

module.exports = initialize