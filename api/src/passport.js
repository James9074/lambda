'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
}; /**
    * Node.js API Starter Kit (https://reactstarter.com/nodejs)
    *
    * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE.txt file in the root directory of this source tree.
    */

/* eslint-disable no-param-reassign, no-underscore-dangle, max-len */

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGoogleOauth = require('passport-google-oauth');

var _passportFacebook = require('passport-facebook');

var _passportTwitter = require('passport-twitter');

var _passportGithub = require('passport-github');

var _passportLDAP = require('passport-ldapauth');

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

_passport2.default.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    displayName: user.displayName,
    imageUrl: user.imageUrl,
    emails: user.emails,
    username: user.username,
    admin: user.admin
  });
});

_passport2.default.deserializeUser((user, done) => {
  done(null, user);
});

// Creates or updates the external login credentials
// and returns the currently authenticated user.
async function login(req, provider, profile, tokens) {
  let user;

  if (req.user) {
    user = await _db2.default.table('users').where({ id: req.user.id }).first();
  }

  if (!user) {
    user = await _db2.default.table('logins').innerJoin('users', 'users.id', 'logins.user_id').where({ 'logins.provider': provider, 'logins.id': profile.id }).first('users.*');
    if (!user && profile.emails && profile.emails.length && profile.emails[0].verified === true) {
      user = await _db2.default.table('users').where('emails', '@>', JSON.stringify([{ email: profile.emails[0].value, verified: true }])).first();
    }
  }

  if (!user) {
    user = (await _db2.default.table('users').insert({
      display_name: profile.displayName,
      username: profile.username, // TODO: Make sure this is A) there, and B) unique, +generate unique if needed
      emails: JSON.stringify((profile.emails || []).map(x => ({
        email: x.value,
        verified: x.verified || false
      }))),
      admin: profile.username.toLowerCase() === (process.env.ADMIN_USERNAME !== undefined ? process.env.ADMIN_USERNAME : '').toLowerCase() ? 1 : 0,
      image_url: profile.photos && profile.photos.length ? profile.photos[0].value : null
    }).returning('*'))[0];
  }

  const loginKeys = { user_id: user.id, provider, id: profile.id };
  const { count } = await _db2.default.table('logins').where(loginKeys).count('id').first();

  if (count === '0') {
    await _db2.default.table('logins').insert(_extends({}, loginKeys, {
      username: profile.username,
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify(profile._json)
    }));
  } else {
    await _db2.default.table('logins').where(loginKeys).update({
      username: profile.username,
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify(profile._json),
      updated_at: _db2.default.raw('CURRENT_TIMESTAMP')
    });
  }

  return {
    id: user.id,
    displayName: user.display_name,
    imageUrl: user.image_url,
    emails: user.emails,
    username: user.username,
    admin: user.admin
  };
}

// https://github.com/jaredhanson/passport-google-oauth2
_passport2.default.use(new _passportGoogleOauth.OAuth2Strategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/login/google/return',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const user = await login(req, 'google', profile, {
      accessToken,
      refreshToken
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// https://github.com/jaredhanson/passport-facebook
_passport2.default.use(new _passportFacebook.Strategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  profileFields: ['name', 'email', 'picture', 'link', 'locale', 'timezone', 'verified'],
  callbackURL: '/login/facebook/return',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (profile.emails.length) profile.emails[0].verified = !!profile._json.verified;
    profile.displayName = profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`;
    const user = await login(req, 'facebook', profile, {
      accessToken,
      refreshToken
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// https://github.com/jaredhanson/passport-twitter
_passport2.default.use(new _passportTwitter.Strategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: '/login/twitter/return',
  includeEmail: true,
  includeStatus: false,
  passReqToCallback: true
}, async (req, token, tokenSecret, profile, done) => {
  try {
    if (profile.emails && profile.emails.length) profile.emails[0].verified = true;
    const user = await login(req, 'twitter', profile, {
      token,
      tokenSecret
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// https://github.com/jaredhanson/passport-github
_passport2.default.use(new _passportGithub.Strategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const user = await login(req, 'github', profile, {
      accessToken,
      refreshToken
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));


// https://github.com/vesse/passport-ldapauth
_passport2.default.use(new _passportLDAP.Strategy({
  server: {
    url: process.env.LDAP_URL,
    bindDN: process.env.LDAP_BIND_DN,
    bindCredentials: process.env.LDAP_BIND_PW,
    searchBase: process.env.LDAP_SEARCH_BASE,
    searchFilter: process.env.LDAP_SEARCH_FILTER
  }
}));

exports.default = _passport2.default;
//# sourceMappingURL=passport.js.map

