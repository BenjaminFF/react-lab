/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import {
  Route, Link, Switch, withRouter,
} from 'react-router-dom'
import { isMobile } from 'react-device-detect'

import './App.scss';
import routes from './router'
import _ from 'lodash'

class App extends Component {
  constructor(props) {
    super(props)
    const pageSize = isMobile ? routes.length : 9;
    let pages = isMobile ? 1 : parseInt(routes.length / pageSize, 10)
    pages = (!isMobile && routes.length % pageSize != 0) ? pages + 1 : pages
    const gridTemplateColumns = isMobile ? `repeat(1,${window.innerWidth * 0.9}px)` : 'repeat(3,12rem)'
    const gridTemplateRows = isMobile ? `repeat( ${routes.length},${window.innerWidth * 0.9}px)` : 'repeat(3,12rem)'
    const marginTop = isMobile ? window.innerWidth * 0.05 : 5
    const pageItems = []
    for (let i = 0; i < pages; i += 1) {
      pageItems.push(i)
    }
    let colors = ['#3066BE', '#A5668B', '#69306D', '#3C3744', '#248232', '#8C4843', '#593C8F', '#00ad5d', '#0FA3B1']
    colors = _.shuffle(colors)
    let links = routes.slice(0, pageSize)
    links.forEach((item, index) => {
      item.bg = colors[index]
    })
    this.state = {
      pages,
      colors,
      pageSize,
      pageItems,
      marginTop,
      gridTemplateRows,
      gridTemplateColumns,
      curPage: 0,
      links
    }
  }

  componentDidMount() {
    const { pathname } = this.props.location;
    this.setState({
      isHome: pathname == '/',
    });

    this.props.history.listen((router) => {
      this.onRouterChange(router)
    });
  }

  onRouterChange(router) {
    const { pathname } = router
    this.setState({
      isHome: pathname == '/',
    })
  }

  pageToggle(curPage) {
    let { pageSize, colors } = this.state
    const links = routes.slice(curPage * pageSize, curPage * pageSize + pageSize)
    colors = _.shuffle(colors)
    links.forEach((item, index) => {
      item.bg = colors[index]
    })
    this.setState({
      links,
      curPage,
    });
  }

  enterLink() {
    this.setState({
      isHome: false,
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.isHome && <div className="header" />}
        {this.state.isHome && (
          <div className="body">
            <div className="links-container" style={{ gridTemplateColumns: this.state.gridTemplateColumns, gridTemplateRows: this.state.gridTemplateRows, height: isMobile ? '100%' : 'fit-content' }}>
              {this.state.links.map((link, index) => (
                <Link key={index} className="link-container" style={{ marginTop: `${this.state.marginTop}px`, backgroundColor: `${link.bg}` }} onClick={this.enterLink.bind(this)} to={link.path}>
                  {link.name}
                </Link>
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
              />
            ))}
          </Switch>
        )}

      </div>
    );
  }
}

export default withRouter(App)
