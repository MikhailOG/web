import React, { Component } from 'react';
import Header from '../components/Header/Header';
import Nav from '../components/Nav/Nav';
import LayoutContext from '../context/layout-context';
import Backdrop from '../components/Backdrop/Backdrop';
import JobInfo from '../components/Checkout/JobInfo';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';

class Layout extends Component {
    state = {
        firstMount: false,
        // showBackdrop: false,
        // showCheckout: true
    };

    componentDidMount() {
        if (!this.state.firstMount) {
            this.props.onResize();
            this.setState({
                firstMount: true
            });
        }
        window.addEventListener('resize', this.props.onResize);
    };
    componentWillUnmount(){
        window.removeEventListener('resize', this.props.onResize);
    };

    // hideBackdrop() {
    //     this.setState({showBackdrop: false})
    // };
    // showBackdrop() {
    //     this.setState({showBackdrop: true})
    // }
    
    render() {
        return(
            <div onClick={this.props.click} className="web">
            <Backdrop showBackdrop={this.props.showBackdrop}></Backdrop>
            <div className="grid-container">
                <Header title="Тепловые Линии Мск" titleText="Алмазная резка и алмазное бурение" telefone="+7 (926) 932 68 40"/>
                <Nav/>
            </div>
            <LayoutContext.Provider value={{
                windowWidth: this.props.innerWidth,
                windowHeight: this.props.innerHeight
            }}>
                <div className="main-container">
                        {this.props.children}
                        <JobInfo 
                        showJobInfo={this.props.showJobInfo}
                        canvasSize={Math.min(this.props.innerWidth, this.props.innerHeight)*0.75*8/12}/>
                </div>
            </LayoutContext.Provider>
            </div>


        );
    };
};

const mapStateToProps = state => {
    return {
        innerWidth: state.layout.innerWidth,
        innerHeight: state.layout.innerHeight,
        showBackdrop: state.layout.showBackdrop,
        showJobInfo: state.calc.jobInfo.showJobInfo,
        jobInfo: state.calc.jobInfo
    };
};

const mapDispatchToPros = dispatch => {
    return {
        onResize: () => dispatch(actionCreators.windowResize()),
        onToggleBackdrop: () => dispatch(actionCreators.toggleBackdrop()),
        
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Layout);