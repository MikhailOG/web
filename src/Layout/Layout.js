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
    componentWillMount() {
        if (!this.state.firstMount) {
            this.handleResize();
            this.setState({
                firstMount: true
            });
        }
    };
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    };
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize);
    };
    handleResize = () => {
        this.setState({
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        });
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
            <Backdrop showBackdrop={this.state.showBackdrop}></Backdrop>
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
                        showCheckout={this.state.showCheckout}
                        canvasSize={Math.min(this.state.innerWidth, this.state.innerHeight)*0.75*8/12}/>
                </div>
            </LayoutContext.Provider>
            </div>


        );
    };
};

const mapStateToProps = state => {
    return {

    };
}

export default connect(mapStateToProps)(Layout);