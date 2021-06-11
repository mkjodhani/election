import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import App from './App'
import Election from './component/Election';
import {BrowserRouter as Router ,Route ,Switch } from 'react-router-dom'
import NewElection from './component/NewElection';
ReactDOM.render(
    <Router>
      <Switch>
        <Route exact path="/">
          <App/>
        </Route>
        <Route exact path="/election/new">
          <NewElection/>
        </Route>
        <Route exact path="/election/:id">
          <Election/>
        </Route>
      </Switch>
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
