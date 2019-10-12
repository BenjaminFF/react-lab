/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import {
  Route, Link, Switch, withRouter,
} from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import './App.scss';
import routes from './router';

class App extends Component {
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
      links: routes.slice(0, pageSize),
    };
  }

  componentDidMount() {
    const { pathname } = this.props.location;
    this.setState({
      isHome: pathname == '/',
    });

    this.props.history.listen((router) => {
      this.onRouterChange(router);
    });
  }

  onRouterChange(router) {
    const { pathname } = router;
    this.setState({
      isHome: pathname == '/',
    });
  }

  pageToggle(curPage) {
    const { pageSize } = this.state;
    const links = routes.slice(curPage * pageSize, curPage * pageSize + pageSize);
    this.setState({
      links,
      curPage,
    });
  }

  enterLink() {
    this.setState({
      isHome: false,
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.isHome && <div className="header" />}
        {this.state.isHome && (
        <div className="body">
          <div className="links-container" style={{ gridTemplateColumns: this.state.gridTemplateColumns, gridTemplateRows: this.state.gridTemplateRows, height: isMobile ? '100%' : 'fit-content' }}>
            {this.state.links.map((link, index) => (
              <div key={index} className="link" style={{ marginTop: `${this.state.marginTop}px` }}>
                <Link to={link.path} onClick={this.enterLink.bind(this)}>{link.name}</Link>
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
        </div>
        )}
        {!this.state.isHome && (
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
              forceRefresh
            />
          ))}
        </Switch>
        )}
      </div>
    );
  }
}

export default withRouter(App);
