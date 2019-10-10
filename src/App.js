/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import './App.scss';
import routes from './router';

export default class Schulte extends Component {
  constructor(props) {
    super(props);
    const pageSize = isMobile ? routes.length : 9;
    let pages = isMobile ? 1 : parseInt(routes.length / pageSize, 10);
    pages = (!isMobile && routes.length % pageSize != 0) ? pages + 1 : pages;
    const gridTemplateColumns = isMobile ? `repeat(1,${window.innerWidth * 0.9}px)` : 'repeat(3,12rem)';
    const gridTemplateRows = isMobile ? `repeat( ${routes.length},${window.innerWidth * 0.9}px)` : 'repeat(3,12rem)';
    const marginTop = isMobile ? window.innerWidth * 0.05 : 5;
    const pageItems = [];
    for (let i = 0; i < pages; i += 1) {
      pageItems.push(i);
    }
    this.state = {
      pages,
      pageSize,
      pageItems,
      marginTop,
      gridTemplateRows,
      gridTemplateColumns,
      curPage: 0,
      enterItem: false,
      links: routes.slice(0, pageSize),
    };
  }

  pageToggle(curPage) {
    const { pageSize } = this.state;
    const links = routes.slice(curPage * pageSize, curPage * pageSize + pageSize);
    this.setState({
      links,
      curPage,
    });
  }

  render() {
    return (
      <div className="App">
        <div className="header" />
        <div className="body">
          <div className="links-container" style={{ gridTemplateColumns: this.state.gridTemplateColumns, gridTemplateRows: this.state.gridTemplateRows, height: isMobile ? '100%' : 'fit-content' }}>
            {this.state.links.map((link, index) => (
              <div key={index} className="link" style={{ marginTop: `${this.state.marginTop}px` }}>
                {link.name}
              </div>
            ))}
            {isMobile && <div className="bottom">~~到底了~~</div>}
          </div>
          {(!isMobile && this.state.pages > 1) && (
          <div className="pageitems-container">
            {
              this.state.pageItems.map((pageItem) => (
                <div key={pageItem} className={`page-item ${pageItem === this.state.curPage ? 'page-item-active' : null}`} onClick={this.pageToggle.bind(this, pageItem)} />
              ))
            }
          </div>
          )}
          {this.state.enterItem && (
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
          )}
        </div>
      </div>
    );
  }
}
