/* @flow */

import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import flash from 'express-flash';
import i18next from 'i18next';
import * as child from 'child_process';
import i18nextMiddleware, { LanguageDetector } from 'i18next-express-middleware';
import i18nextBackend from 'i18next-node-fs-backend';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import fs from 'fs'
import { printSchema } from 'graphql';
import email from './email';
import redis from './redis';
import passport from './passport';
import schema from './schema';
import DataLoaders from './DataLoaders';
import accountRoutes from './routes/account';
import db from './db';

i18next
  .use(LanguageDetector)
  .use(i18nextBackend)
  .init({
    preload: ['en', 'de'],
    ns: ['common', 'email'],
    fallbackNS: 'common',
    detection: {
      lookupCookie: 'lng',
    },
    backend: {
      loadPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
    },
  });

const app = express();

app.set('trust proxy', 'loopback');

app.use(cors({
  origin(origin, cb) {
    const whitelist = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
    cb(null, whitelist.includes(origin));
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  store: new (connectRedis(session))({ client: redis }),
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));
app.use(i18nextMiddleware.handle(i18next));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); //eslint-disable-line
    return v.toString(16);
  });
}

function execute(command, callback){
  child.exec(command, (err, stdout, stderr) => callback(err, stdout, stderr))
}

function processLambda(lambda, req, res) {
  let lambdaInputArray = []
  try {
    lambdaInputArray = lambda.inputs.map(x => `${x.value.toString()}`)
  } catch (e) { return res.status(400).json({ error: 'Values were not provided for all inputs' }) }

  let expression = `
  ${lambda.code}
  if(typeof(entryPoint) === 'function'){
    if (entryPoint.constructor.name === 'AsyncFunction')
      entryPoint(${JSON.stringify(lambdaInputArray)}).then((x)=>console.log(x))
    else
      console.log(entryPoint(${JSON.stringify(lambdaInputArray)}))
  } else
    console.log("You must provide a function named entryPoint")`;
  let result = '';

  try {
    let tempFile = `/tmp/files/${uuidv4()}.js`
    fs.writeFile(tempFile, expression, 'utf8', (saveError) => {
      if (saveError)
        return res.json({ error: 'Error saving file', details: saveError });

      let dockerstr = `docker run --rm -v ${tempFile}:${tempFile} node:8-alpine node ${tempFile} && rm ${tempFile}`
      execute(dockerstr, (err, stdout, stderr) => {
        if (/(entryPoint is not defined)+/.test(stderr)) stderr = "You must provide a function named 'entryPoint'" //eslint-disable-line
        if (stdout.trim() === 'undefined') stdout = 'Nothing returned!'; //eslint-disable-line
        if (stderr){
          return res.status(400).json({ lambda_error: stderr.trim() })
        } else if (err){
          return res.status(500).json({ error: err })
        } else {
          return res.json({ output: stdout.trim() })
        }
      });
    });
  } catch (e) {
    result = e.toString();
    if (result === undefined)
      result = 'undefined'
    if (result === null)
      result = 'null'
    if (result.length === 0)
      result = 'Nothing returned'

    res.json(result)
  }
}


app.get('/graphql/schema', (req, res) => {
  res.type('text/plain').send(printSchema(schema));
});

app.post('/lambda', (req, res) => {
  let lambda = Object.assign({}, req.body.lambda)
  if (lambda){
    lambda.inputs.forEach((input) => { input.value = input.example }) //eslint-disable-line
    return processLambda(lambda, req, res);
  } else return res.json({ error: 'You need to provide a Lambda object!' })
});

app.get('/lambda/:slug', (req, res) => {
  db
    .table('lambdas')
    .whereIn('slug', [req.params.slug])
    .select()
    .then((lambdas) => {
      if (lambdas.length === 0)
        return res.json({
          error: `Lambda with slug ${req.params.slug} not found!`
        })

      let lambda = lambdas[0]
      let queryValues = Object.keys(req.query).map(key => req.query[key])
      let inputNames = lambda.inputs.map(x => x.name)

      let error = false;

      if (queryValues.length !== inputNames.length)
        error = 'Incorrect Param Length'

      if (!inputNames.every((e, i) => e.toLowerCase() === (Object.keys(req.query)[i] === undefined ? false : Object.keys(req.query)[i].toLowerCase())))
        error = 'Incorrect Param Names'

      if (error)
        return res.json({
          error,
          expected: lambda.inputs
        })

      lambda.inputs.forEach((input, index) => { input.value = queryValues[index] })
      processLambda(lambda, req, res)
    })
});

app.use('/graphql', expressGraphQL(req => ({
  schema,
  context: {
    t: req.t,
    user: req.user,
    ...DataLoaders.create(),
  },
  graphiql: process.env.NODE_ENV !== 'production',
  pretty: process.env.NODE_ENV !== 'production',
  formatError: error => ({
    message: error.message,
    state: error.originalError && error.originalError.state,
    locations: error.locations,
    path: error.path,
  }),
})));

app.use(accountRoutes);

// The following routes are intended to be used in development mode only
if (process.env.NODE_ENV !== 'production') {
  // A route for testing email templates
  app.get('/:email(email|emails)/:template', (req, res) => {
    const message = email.render(req.params.template, { t: req.t, v: 123 });
    res.send(message.html);
  });

  // A route for testing authentication/authorization
  app.get('/', (req, res) => {
    if (req.user) {
      res.send(`<p>${req.t('Welcome, {{user}}!', { user: req.user.displayName })} (<a href="javascript:fetch('/login/clear', { method: 'POST', credentials: 'include' }).then(() => window.location = '/')">${req.t('log out')}</a>)</p>`);
    } else {
      res.send(`<p>${req.t('Welcome, guest!')} (<a href="/login/github">${req.t('sign in')}</a>)</p>`);
    }
  });
}

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
