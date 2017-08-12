/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import URL from 'url';
import passport from 'passport';
import validator from 'validator';
import { Router } from 'express';

const router = new Router();

// External login providers. Also see src/passport.js.
const loginProviders = [
  {
    provider: 'facebook',
    options: { scope: ['email', 'user_location'] },
  },
  {
    provider: 'google',
    options: { scope: 'profile email' },
  },
  {
    provider: 'twitter',
    options: {},
  },
  {
    provider: 'github',
    options: { scope: 'profile email' },
  },
];

// '/about' => ''
// http://localhost/some/page => http://localhost
function getOrigin(url: string) {
  if (!url || url.startsWith('/')) return '';
  return (x => `${String(x.protocol)}//${String(x.host)}`)(URL.parse(url));
}

// '/about' => `true` (all relative URL paths are allowed)
// 'http://localhost/about' => `true` (but only if its origin is whitelisted)
function isValidReturnURL(url: string) {
  if (url.startsWith('/')) return true;
  const whitelist = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [];
  return (
    validator.isURL(url, {
      require_tld: false,
      require_protocol: true,
      protocols: ['http', 'https'],
    }) && whitelist.includes(getOrigin(url))
  );
}

// Generates a URL for redirecting a user to upon successfull authentication.
// It is intended to support cross-domain authentication in development mode.
// For example, a user goes to http://localhost/login (frontend) to sign in,
// then he's being redirected to http://localhost/api/login/facebook (backend),
// Passport.js redirects the user to Facebook, which redirects the user back to
// http://localhost/api/login/facebook/return and finally, user is being redirected
// to http://localhost/?sessionID=xxx where front-end middleware can save that
// session ID into cookie (res.cookie.sid = req.query.sessionID).
function getSuccessRedirect(req) {
  const url = req.query.return || req.body.return || '/';
  if (!isValidReturnURL(url)) return '/';
  if (!getOrigin(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}sessionID=${req.cookies
    .sid}${req.session.cookie.originalMaxAge
    ? `&maxAge=${req.session.cookie.originalMaxAge}`
    : ''}`;
}

// Registers route handlers for the external login providers
loginProviders.forEach(({ provider, options }) => {
  router.get(
    `/login/${provider}`,
    (req, res, next) => {
      req.session.returnTo = getSuccessRedirect(req);
      next();
    },
    passport.authenticate(provider, { failureFlash: true, ...options }),
  );

  router.get(`/login/${provider}/return`, (req, res, next) =>
    passport.authenticate(provider, {
      successReturnToOrRedirect: true,
      failureFlash: true,
      failureRedirect: `${getOrigin(req.session.returnTo)}/login`,
    })(req, res, next),
  );
});

// Remove the `user` object from the session. Example:
//   fetch('/login/clear', { method: 'POST', credentials: 'include' })
//     .then(() => window.location = '/')
router.post('/login/clear', (req, res) => {
  req.logout();
  res.status(200).send('OK');
});

// Allows to fetch the last login error(s) (which is usefull for single-page apps)
router.post('/login/error', (req, res) => {
  res.send({ errors: req.flash('error') });
});

export default router;
