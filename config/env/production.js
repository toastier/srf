'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/faculty-recruitment-system',
  saml: {
    path: '/auth/saml/callback',
    callbackURL: 'http://localhost:3000/auth/saml/callback'
  },
  email: {
    dfa: 'david.parrish@duke.edu'
  }
};
