import React from 'react'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import path from 'path'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import qs from 'query-string';
import serialize from 'serialize-javascript';
import { createMemoryHistory } from 'history';
import open from 'open'

import App from '../client/containers/App'
import configureStore from '../client/store/configureStore'
import config from '../../../webpack.config'
import reducer from '../client/reducers';
import routes from '../routes';
import {reduxReactRouter, match} from '../../src/server'; // 'redux-router/server';

var app = express()
var port = 3000
var compiler = webpack(config)

// var db = require('monk')('localhost:27017/geekjiang')
// var images = db.get('images');
// images.find({}, function(err, docs) {
//    console.log(docs)
// })

const getMarkup = (store) => {
  const initialState = serialize(store.getState());
  const markup = renderToString(
    <Provider store={store} key="provider">
      <ReduxRouter/>
    </Provider>
  );
	
  return `<!doctype html>
    <html>
      <head>
        <title>Redux React Router – Server rendering Example</title>
      </head>
      <body>
        <div id="root">${markup}</div>
        <script>window.__initialState = ${initialState};</script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
};

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use((req, res) => {
  // TO DO 
  // console.log(createStore, createMemoryHistory)
  const store = reduxReactRouter({ routes, createHistory: createMemoryHistory })(createStore)(reducer);
  console.log(store, '============')
  const query = qs.stringify(req.query);
  const url = req.path + (query.length ? '?' + query : '');

  store.dispatch(match(url, (error, redirectLocation, routerState) => {
    if (error) {
      console.error('Router error:', error);
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!routerState) {
      res.status(400).send('Not Found');
    } else {
      res.status(200).send(getMarkup(store));
    }
  }));
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    open("http://localhost:"+port);
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})



