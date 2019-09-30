/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import './App.scss';
import routes from './router';

export default class Schulte extends Component {
  constructor(props) {
    super(props);
    const pageSize = isMobile ? 9 : 1;
    this.state = {
      links: routes.slice(0, pageSize),
      pages: parseInt(routes.length / pageSize),
      pageSize,
    };
  }

  render() {
    return (
      <div className="App">
        <div className="header" />
        <div className="body">
          <div className="links-container">
            {this.state.links.map((link, index) => (
              <div key={index} className="link">
                {link.name}
              </div>
            ))}
          </div>
          <Router>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            ))}
          </Router>
        </div>
      </div>
    );
  }
}
