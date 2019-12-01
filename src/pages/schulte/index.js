/* eslint-disable prefer-const */
/* eslint-disable no-alert */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'
import './index.scss'
import _ from 'lodash'

export default class Schulte extends Component {
  constructor(props) {
    super(props);
    let schulteModes;
    const schulteRecordsJson = localStorage.getItem('schulte-record');
    if (schulteRecordsJson === null) {
      schulteModes = [
        { mode: 16, record: 0, text: '4x4' },
        { mode: 25, record: 0, text: '5x5' },
        { mode: 36, record: 0, text: '6x6' },
        { mode: 49, record: 0, text: '7x7' },
      ];
    } else {
      schulteModes = JSON.parse(schulteRecordsJson);
    }
    schulteModes.forEach((element, index) => {
      index === 0 ? element.selected = true : element.selected = false
    });
    const cells = []
    for (let i = 0; i < schulteModes[0].mode; i += 1) {
      cells.push({ index: i + 1, active: false })
    }
    const gridTemplateColumns = `repeat(${Math.sqrt(schulteModes[0].mode)},5rem)`
    const gridTemplateRows = `repeat( ${Math.sqrt(schulteModes[0].mode)},5rem)`
    this.state = {
      schulteModes,
      curMode: schulteModes[0],
      gridTemplateRows,
      gridTemplateColumns,
      cells: _.shuffle(cells),
      curCellIndex: 1,
      gameStarted: false,
      recordInterval: null,
      tempRecord: 0,
    };
    this.onModeChange = this.onModeChange.bind(this)
    this.startGame = this.startGame.bind(this)
  }

  formatRecord(record) {
    const minute = Math.floor(record / 60)
    const second = record % 60
    return `${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second}`
  }

  startGame() {
    this.state.recordInterval = setInterval(() => {
      let { tempRecord } = this.state;
      tempRecord++;
      this.setState({
        tempRecord,
      });
    }, 1000);
    this.setState({
      gameStarted: true,
    })
  }

  onModeChange(event) {
    const mode = event.target.value;
    const curMode = this.state.schulteModes.filter((schulteMode) => schulteMode.mode == mode)[0]
    const gridTemplateColumns = `repeat(${Math.sqrt(curMode.mode)},5rem)`
    const gridTemplateRows = `repeat( ${Math.sqrt(curMode.mode)},5rem)`
    const cells = []
    for (let i = 0; i < curMode.mode; i += 1) {
      cells.push({ index: i + 1, active: false });
    }
    this.setState({
      curMode,
      gridTemplateColumns,
      gridTemplateRows,
      cells: _.shuffle(cells),
      curCellIndex: 1,
      gameStarted: false,
      tempRecord: 0,
    });
    if (this.state.recordInterval != null) {
      clearInterval(this.state.recordInterval)
    }
  }

  onCellClick(cellIndex) {
    if (!this.state.gameStarted) {
      return
    }
    const cells = [...this.state.cells];
    let { curCellIndex, curMode, tempRecord } = this.state
    if (cellIndex == curCellIndex) {
      cells.filter((cell) => cell.index == cellIndex)[0].active = true
      curCellIndex++
    }
    this.setState({
      cells,
      curCellIndex,
    });

    if (curCellIndex > curMode.mode) {
      if (this.state.recordInterval != null) {
        clearInterval(this.state.recordInterval);
      }
      setTimeout(() => {
        alert(`你完成了，记录为${this.formatRecord(tempRecord)}`);
        if (tempRecord < curMode.record || curMode.record == 0) {
          curMode.record = tempRecord;
          localStorage.setItem('schulte-record', JSON.stringify(this.state.schulteModes));
          this.setState({
            curMode,
          })
        }

        const newCells = []
        for (let i = 0; i < curMode.mode; i += 1) {
          newCells.push({ index: i + 1, active: false })
        }
        this.setState({
          gameStarted: false,
          tempRecord: 0,
          cells: _.shuffle(newCells),
          curCellIndex: 1,
        });
      }, 500)
    }
  }

  render() {
    return (
      <div className="schulte-container">
        <div className="inner">
          <div className="schulte-nav">
            <select onChange={this.onModeChange}>
              {
                this.state.schulteModes.map((schulteMode) => (
                  <option value={schulteMode.mode} key={schulteMode.mode}>{schulteMode.text}</option>
                ))
              }
            </select>
            {!this.state.gameStarted && (
              <div>
                最高纪录：
                {this.formatRecord(this.state.curMode.record)}
              </div>
            )}
            {this.state.gameStarted && (
              <div>
                {this.formatRecord(this.state.tempRecord)}
              </div>
            )}
          </div>
          <div className="schulte-body">
            {!this.state.gameStarted && <div className="button" onClick={this.startGame}>开始</div>}
            <div className="cells-container" style={{ gridTemplateColumns: this.state.gridTemplateColumns, gridTemplateRows: this.state.gridTemplateRows }}>
              {this.state.cells.map((cell) => (
                <div className={['cell', cell.active ? 'active' : ''].join(' ')} onClick={this.onCellClick.bind(this, cell.index)} key={cell.index}>
                  {cell.index}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  }
}
