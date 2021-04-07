import React, { Component, Fragment } from 'react';
import Button from '../UI/Button';
import Price from '../Price/Price';
import { connect } from 'react-redux';
import { convertRemToPixels } from '../../Scripts/convertRemToPixels';
import { canvas } from '../../Scripts/canvas';
import * as actionCreators from '../../store/actions/index';
import { string } from 'prop-types';

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
    wastePrice = 3000;
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
        // get coordinates of current job
        let j; // material type
        switch (this.props.currentJob.preferences.material) {
            case "brick":
                j = 1;
                break;
            case "concrete":
                j = 2;
                break;
            case "reinforced-concrete":
                j = 3;
                break;
            default: 
                j = 1;
                break;
        }
        let jobIndex; // job type
        switch (this.props.currentJob.serviceName) {
            case 'newCoring':
                jobIndex = 1;
                break;
            case 'enhancementCoring':
                jobIndex = 1;
                break;
            default: 
                jobIndex = 1;
                break;
        }
        // ------------------------------------------------------------------
        let price;
        let ending;
        let holesNum;
        let priceText;
        if (this.state.canvasInfo) {
            //get price from table-------------------------------------------------------------------------------------------------
            let priceLength = Object.keys(Price().props.children[jobIndex].props.children[2].props.children).length;
            for (let i = 0; i < priceLength; i++) {
                let hyphenIndex = Price().props.children[jobIndex].props.children[2].props.children[i].props.children[0].props.children.indexOf('-');
                if (hyphenIndex === -1) {
                    if (this.state.canvasInfo.input.diameter === parseInt(Price().props.children[1].props.children[2].props.children[i].props.children[0].props.children, 10))
                        price = parseInt(Price().props.children[jobIndex].props.children[2].props.children[i].props.children[j].props.children, 10);
                }
                else {
                    let priceValues = Price().props.children[jobIndex].props.children[2].props.children[i].props.children[0].props.children.split('-');
                    if (priceValues[0] <= this.state.canvasInfo.input.diameter && priceValues[1] >= this.state.canvasInfo.input.diameter)
                        price = parseInt(Price().props.children[jobIndex].props.children[2].props.children[i].props.children[j].props.children, 10);
                }
            }
        //-------------------------------------------------------------------------------------------------
            if (this.state.canvasInfo.partsQty!==0) {
                console.log(this.state.canvasInfo)
                let qty = this.state.canvasInfo.partsQty.toString();
                    if ((parseInt(qty.charAt(qty.length-1), 10) === 1) && (this.state.canvasInfo.partsQty !== 11))
                        ending = "часть";
                    else if ((parseInt(qty.charAt(qty.length-1), 10) < 5) && (parseInt(qty.charAt(qty.length-1), 10) !==0) && ((this.state.canvasInfo.partsQty < 5) || (this.state.canvasInfo.partsQty > 20)))
                        ending = "части";
                    else
                        ending = "частей";
            }
            holesNum = this.state.canvasInfo.mainHolesNum;
            if (this.state.canvasInfo.sepHolesNum) 
                holesNum += this.state.canvasInfo.sepHolesNum;
                // calculating price
                let waterFactor = this.props.currentJob.preferences.water[0] === "water-off" ? 1:1.25;
                let elevationFactor = this.props.currentJob.preferences.elevation[0] === "elevation-under-limit" ? 1:1.15;
                price *= waterFactor*elevationFactor*100;
                switch (jobIndex) {
                    case 1: 
                    let coringLength = holesNum*this.state.canvasInfo.input.depth/1000;
                    let singleEmbrasurePrice = Math.round(price*coringLength);
                    let totalCoringPrice = this.props.currentJob.data.qty === 1 ? singleEmbrasurePrice : singleEmbrasurePrice*this.props.currentJob.data.qty;
                    let totalWastePrice = Math.round(this.wastePrice * this.state.canvasInfo.totalWeight / 1000);
                    let multiEmbrasure = this.props.currentJob.data.qty === 1 ? null :
                    <Fragment>
                        <h3>Метраж бурения {this.props.currentJob.data.qty} проемов: {coringLength*this.props.currentJob.data.qty} м</h3>
                        <h3>Стоимость бурения {this.props.currentJob.data.qty} проемов: {totalCoringPrice} &#x20bd;</h3>
                    </Fragment>
                    let holesEnding = this.props.currentJob.data.qty === 1 ? null : " в одном проеме";
                    let singleEmbrasureEnding = this.props.currentJob.data.qty === 1 ? null : " 1 проема";
                    priceText = (
                        <Fragment>
                            <h3>Количество отверстий &#xD8;{this.state.canvasInfo.input.diameter} x {this.state.canvasInfo.input.depth} мм{holesEnding} : {holesNum} шт.</h3>
                            {this.state.canvasInfo.partsQty===0? null:
                                <Fragment>
                                    <h3>Проем поделен на {this.state.canvasInfo.partsQty} {ending}</h3>
                                    <h3>Вес одной части {Math.round(this.state.canvasInfo.singlePartWeight)} кг</h3>
                                    {priceText}
                                </Fragment>
                            }
                            <h3>Метраж бурения{singleEmbrasureEnding}: {coringLength} м</h3>
                            <h3>Стоимость бурения{singleEmbrasureEnding}: {singleEmbrasurePrice} &#x20bd;</h3>
                            {multiEmbrasure}
                            <h3>Вес мусора: {Math.round(this.state.canvasInfo.totalWeight)} кг</h3>
                            <h3>Стоимость выноса мусора (без вывоза): {totalWastePrice} &#x20bd;</h3>
                            <h3>Стоимость итого: {totalWastePrice + totalCoringPrice} &#x20bd;</h3>
                    </Fragment>)
                }
        }
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
                                {priceText}
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