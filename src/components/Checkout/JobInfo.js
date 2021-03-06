import React, { Component } from 'react';
import Button from '../UI/Button';
import { connect } from 'react-redux';
import { convertRemToPixels } from '../../Scripts/convertRemToPixels';
import { canvas } from '../../Scripts/canvas';
import * as actionCreators from '../../store/actions/index';

class JobInfo extends Component {
    state={
        wrapperStyle: {transform: 'translateY(-100vh)'},
        checkoutStyle: {},
        canvasStyle: {},
        canvasGradientAngle: '45deg',
        escapeButtonLeftPosition: null,
        escaped: false,
        canvasInfo: null
    }
    animationDuration = '0.5s';

    componentDidMount() {
        console.log('[JobInfo.js] did mount')
        window.addEventListener('resize', this.handleResize);
        if (this.state.escapeButtonLeftPosition === null && document.documentElement.querySelector('.job-info')){
            this.setState({
                escapeButtonLeftPosition: parseFloat(getComputedStyle(document.documentElement.querySelector('.job-info')).width) - convertRemToPixels(2.4)
            })
        };
        if (this.state.wrapperStyle.transform === 'translateY(-100vh)' && this.props.showJobInfo){
            console.log('transform')
            setTimeout(() => {
                this.setState({wrapperStyle: {transform: 'translateY(0)'}})
            }, 10)
        }
        if (this.props.currentJob.showCanvas && this.state.canvasInfo == null) {
            canvas(this.props.currentJob.serviceName, this.props.currentJob.data, this.props.currentJob.preferences.concreteWeight, this.props.currentJob.preferences.wasteWeight)
            .then(response => this.setState({canvasInfo: response}))
        }

    };
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize);
    };

    handleResize = () => {
        if (document.documentElement.querySelector('.escape') && (this.state.escapeButtonLeftPosition != parseFloat(getComputedStyle(document.documentElement.querySelector('.job-info')).width)) - convertRemToPixels(2.4)){
            this.setState({
                escapeButtonLeftPosition: parseFloat(getComputedStyle(document.documentElement.querySelector('.job-info')).width) - convertRemToPixels(2.4)
            })
            canvas(this.props.currentJob.serviceName, this.props.currentJob.data, this.props.currentJob.preferences.concreteWeight, this.props.currentJob.preferences.wasteWeight)
        };
    };

    erase = () => {
        this.setState({
            wrapperStyle: {
                background: "radial-gradient(circle at top right, transparent 39.5%, #10387d 39.5%)",
                animation: "gradientBG " + this.animationDuration + " linear 1 0.0007s",
                backgroundSize: "280% 280%",
                backgroundPosition: "0% 100%"
            },
            checkoutStyle: {
                color: "red",
                background: "radial-gradient(circle at top right, transparent 39.5%, #10387d 39.5% 39.65%, #ABA9BF 39.65%)",
                animation: "gradientBG " + this.animationDuration + " linear 1",
                backgroundSize: "280% 280%",
                backgroundPosition: "0% 100%"
            },
            canvasStyle: {
                backgroundColor: "inherit",
                borderColor: "transparent"
                // background: "radial-gradient(circle at top right, transparent 39.5%, #f3fffd 39.5%)",
                // animation: "gradientBG " + this.animationDuration + " linear 1 0.1s",
                // backgroundSize: "280% 280%",
                // backgroundPosition: "0% 100%"
            },
            escaped: true
        }
        );

    }
    render() {
            return (
                <div className="job-info-wrapper" id="jobInfoWrapper" style={this.state.wrapperStyle}>
                    <div className="job-info" style={this.state.checkoutStyle}>
                        <Button
                            clicked={() => {
                                this.props.onClearJobInfo();
                                this.props.onToggleBackdrop();
                                this.erase();
                                }}
                            classes="escape"
                            style={{top:convertRemToPixels(0.4), left: this.state.escapeButtonLeftPosition}}
                            escaped={this.state.escaped}
                            />
                        <h3>{this.props.currentJob.jobData}</h3>
                            {this.state.canvasInfo == null? null: 
                            <div>
                            <h3>Количество отверстий по периметру: {this.state.canvasInfo.mainHolesNum}</h3>
                            <h3>Проем поделен на {this.state.canvasInfo.partsQty} частей</h3>
                            <h3>Количество отверстий для деления: {this.state.canvasInfo.sepHolesNum}</h3>
                            <h3>Суммарное количество отверстий: {this.state.canvasInfo.mainHolesNum + this.state.canvasInfo.sepHolesNum}</h3>
                            <h3>Вес одной части {Math.round(this.state.canvasInfo.singlePartWeight)} кг</h3>
                            <h3>Общий вес проема (мусора) {Math.round(this.state.canvasInfo.totalWeight)} кг</h3>
                            </div>
                            }
                            {/* <div className='job-description'>
                                <p>{this.props.currentJob.title + ' ' + jobType}</p>
                            </div> */}
                        {this.props.currentJob.showCanvas?<canvas 
                            id="myCanvas" 
                            width={this.props.canvasSize} 
                            height={this.props.canvasSize}
                            style={this.state.canvasStyle}>
                        </canvas>:null}
                    </div>          
                </div>
            );
    }
}
const mapStateToProps = state => {
    return {
        currentJob: state.calc.jobInfo
    };
}

const mapDispatchToPros = dispatch => {
    return {
        onClearJobInfo: () => dispatch(actionCreators.clearJobInfo()),
        onToggleBackdrop: () => dispatch(actionCreators.toggleBackdropAsync()),
        
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(JobInfo);