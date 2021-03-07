import React, { Component } from 'react';
import Header from '../components/Header/Header';
import Nav from '../components/Nav/Nav';
import LayoutContext from '../context/layout-context';
import Backdrop from '../components/Backdrop/Backdrop';
import JobInfo from '../components/Checkout/JobInfo';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import Footer from '../components/Footer/Footer';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.webDiv = React.createRef();
    }
    state = {
        firstMount: false,
        clicked: false,
        clickedEvt: null,
        // showBackdrop: false,
        // showCheckout: true
        webDivStyle: null
    };
    componentDidMount() {
        if (!this.state.firstMount) {
            this.props.onResize();
            this.setState({
                firstMount: true
            });
        }
        window.addEventListener('resize', this.props.onResize);
        if (this.webDiv.current.clientHeight < this.props.innerHeight) {
            this.setState({webDivStyle: {height: '100vh'}})
        }
    };
    componentDidUpdate() {
        if (this.webDiv.current.clientHeight < this.props.innerHeight) {
            this.setState({webDivStyle: {height: '100vh'}})
        }
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.props.onResize);
    };

    clickHandler = (event) => {
        console.log('Clicked')
        if (this.state.clickedEvt) 
            this.setState({clicked: false, clickedEvt: null});
        else         
            this.setState({clicked: true, clickedEvt: event.target}, ()=>{setTimeout(() => 
                this.setState({clicked: false, clickedEvt: null})
            , 50)})
    };
    render() {
        let webDivStyle = null
        this.state.webDivStyle?webDivStyle=this.state.webDivStyle:null
        return(
            <div 
                onClick={(event) => this.clickHandler(event)} 
                style={webDivStyle}
                ref={this.webDiv} 
                className="web">
                <Backdrop 
                    showBackdrop={this.props.showBackdrop}
                    onBockdropClicked={this.props.onToggleBackdrop}
                    />
                <Header 
                    title="Diamond coring" 
                    titleText="Алмазная резка и алмазное бурение" 
                    telefone="+7 (926) 932 68 40"
                    email="info@diamondcoring.ru"
                />
                <Nav/>
                <LayoutContext.Provider value={{
                    windowWidth: this.props.innerWidth,
                    windowHeight: this.props.innerHeight,
                    clicked: this.state.clicked,
                    clickedEvt: this.state.clickedEvt,
                    handleClick: this.clickHandler,
                    toggleBackdrop: this.props.onToggleBackdrop
                }}>
                    <div className="main-container">
                        {this.props.children}
                        {this.props.jobInfo.showJobInfo?
                            <JobInfo 
                                showJobInfo={this.props.jobInfo.showJobInfo}
                                canvasSize={Math.min(this.props.innerWidth, this.props.innerHeight)*0.75*8/12}
                            />:null}
                    </div>
                </LayoutContext.Provider>
                <Footer/>
            </div>
        );
    };
};

const mapStateToProps = state => {
    return {
        innerWidth: state.layout.innerWidth,
        innerHeight: state.layout.innerHeight,
        showBackdrop: state.layout.showBackdrop,
        jobInfo: state.calc.jobInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onResize: () => dispatch(actionCreators.windowResize()),
        onToggleBackdrop: () => dispatch(actionCreators.toggleBackdrop()),
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);