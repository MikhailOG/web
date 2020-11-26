import React, { Component } from 'react';
import Header from '../components/Header/Header';
import Nav from '../components/Nav/Nav';
import LayoutContext from '../context/layout-context';
import Backdrop from '../components/Backdrop/Backdrop';
import Checkout from '../components/Checkout/Checkout';
import { connect } from 'react-redux';

class Layout extends Component {
    state = {
        innerWidth: 0,
        innerHeight: 0,
        firstMount: false,
        showBackdrop: false,
        showCheckout: false // ===showBackdrop?
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

    hideBackdrop() {
        this.setState({showBackdrop: false})
    };
    showBackdrop() {
        this.setState({showBackdrop: true})
    }
    render() {
        return(
            <div onClick={this.props.click} className="web">
            <Backdrop showBackdrop={this.props.showBackdrop}></Backdrop>
            <div className="grid-container">
                <Header title="Тепловые Линии Мск" titleText="Алмазная резка и алмазное бурение" telefone="+7 (926) 932 68 40"/>
                <Nav/>
            </div>
            <LayoutContext.Provider value={{
                windowWidth: this.state.innerWidth,
                windowHeight: this.state.innerHeight
            }}>
                <div className="main-container">
                        {this.props.children}
                        <Checkout 
                        showCheckout={this.props.showBackdrop}
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
        showBackdrop: state.layout.showBackdrop
    };
};

const mapDispatchToPros = dispatch => {
    return {
        onResize: () => dispatch( {type: 'WINDOW_RESIZE', innerWidth: window.innerWidth, innerHeight: window.innerHeight })
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Layout);