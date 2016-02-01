'use strict';

module.exports = {
  db: 'mongodb://localhost/faculty-recruitment-system-dev',
  app: {
    title: 'Faculty Recruitment System - Development Environment',
    description: 'Application for Candidates, Faculty and Staff of DUSON',
    keywords: 'Duke, Duke University, FRS, Faculty Recruitment'
  },
  saml: {
    path: '/auth/saml/callback',
    entryPoint: 'https://duson.onelogin.com/trust/saml2/http-post/sso/503330',
    callbackURL: 'http://localhost:3000/auth/saml/callback',
    issuer: 'frs-passport-saml'
  }
};
