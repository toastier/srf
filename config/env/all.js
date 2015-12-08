'use strict';

module.exports = {
  app: {
    title: 'Faculty Recruitment System',
    description: 'Application for Candidates, Faculty and Staff of DUSON',
    keywords: 'Duke, Duke University, FRS, Faculty Recruitment'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  sendGridSettings: {
    service: 'SendGrid',
    auth: {
      user: 'frs-duson',
      pass: 'gQrrXqEHnLgM93'
    }
  }
};
