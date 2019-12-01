import React, { Component } from 'react';
import './index.scss';
import _ from 'lodash';
import { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } from 'subtitle';
import Audio from 'react-audioplayer';

export default class Schulte extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: true,
            subtitleArr: [],
            mAudio: null
        }
        this.togglePlay = this.togglePlay.bind(this)
    }

    componentDidMount() {
        let mAudio = document.getElementById("mAudio")

        fetch("./DeepaNarayan_2019I.srt").then((res) => res.text()).then((text) => {
            let subtitleArr = parse(text)
            subtitleArr.forEach((item) => {
                item.selected = false
            })


            mAudio.ontimeupdate = () => {
                let selectedSubTitle = subtitleArr.filter((item) => item.selected)[0]
                if (!selectedSubTitle || !(mAudio.currentTime * 1000 > selectedSubTitle.start && mAudio.currentTime * 1000 < selectedSubTitle.end)) {
                    subtitleArr.forEach((item) => {
                        item.selected = false
                    })
                    for (let item of subtitleArr) {
                        if (mAudio.currentTime * 1000 > item.start && mAudio.currentTime * 1000 < item.end) {
                            item.selected = true
                            break
                        }
                    }
                    this.setState({
                        subtitleArr: subtitleArr.filter((item) => item.end < (2 * 60 + 10) * 1000)
                    })
                }
            }
            this.setState({
                mAudio,
                subtitleArr: subtitleArr.filter((item) => item.end < (2 * 60 + 10) * 1000)
            })
        })
    }

    togglePlay() {
        this.setState({
            playing: !this.state.playing
        })
        this.state.playing ? this.state.mAudio.pause() : this.state.mAudio.play()
    }

    render() {
        return (<div className="sl-container">
            {this.state.subtitleArr.map((item) => (
                <div className={['sl-subtitle', item.selected ? 'selected' : ''].join(' ')}>{item.text}</div>
            ))}
            <audio
                width={600}
                height={400}
                autoPlay={true}
                paused={true}
                id="mAudio"
                src="./DeepaNarayan.mp3"
            />
            <div className={['music-controler', this.state.playing ? 'music-controler-playing' : ''].join(' ')} onClick={this.togglePlay}>
                <i className="iconfont rl-music"></i>
            </div>
        </div>
        )
    }
}