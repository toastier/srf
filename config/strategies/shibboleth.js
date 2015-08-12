'use strict';

var passport = require('passport'),
    url = require('url'),
    SamlStrategy = require('passport-saml').Strategy,
    config = require('../config'),
    User = require('mongoose').model('User');

module.exports = function() {

    passport.use(new SamlStrategy(
        {
            callbackUrl: config.saml.callbackURL,
            entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
            issuer: 'frs-passport-saml'
        },
        function(profile, done) {
            var user = {};
            var query = {
                'username': profile.uid
            };

            User.findOne(query, function(error, user) {
                if(user) {
                    console.log('found');
                    done(null, user);
                } else {
                    console.log('not found');
                    user = new User();
                    user.email = profile.email;
                    user.username = profile.uid;
                    user.displayName = profile.cn;
                    user.firstName = profile.givenName;
                    user.lastName = profile.sn;
                    user.provider = 'shib';

                    user.save();
                    done(null, user);
                }
            });
        })
    );
};