import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './styles/App.css';
import Layout from './Layout/Layout';
import Btn from './components/Btn/Btn';
import Services from './components/Btn/Services';
import Input from './components/CalculationRibbon/Input';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/index';

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   console.log('[App.js] constructor');
  // }
  state = {
    currentServiceClass: null,
    hoverIndex: null,
    btnClicked: false,
    selectedService: null,
    rowNum: null
  }
  services= [
    { serviceClass: 'diamond-coring', serviceTitle: ['Алмазное', 'бурение']},
    { serviceClass: 'diamond-saw', serviceTitle: ['Алмазная', 'резка']},
    { serviceClass: 'diamond-wire', serviceTitle: ['Канатная', 'резка']},
    { serviceClass: 'enforcement', serviceTitle: ['Усиление', 'проема']},
  ];
  currentCursorPosition = {
    el: null,
    index: null,
    rendered: false
  }
  selected = {
    id: null
  }
  // static getDerivedStateFromProps(props, state) {
  //   console.log('[App.js] getDerivedStateFrom props', props);
  //   return state; 
  // };
  componentDidMount() {
    console.log('[App.js] componentDidMount');
  }
  getElement = (event) => {
    if (event.target.hasAttribute("type")) {
      const cursorPosition = {...this.currentCursorPosition};
      cursorPosition.el = event.target.getAttribute("type");
      cursorPosition.index = this.services.findIndex(service => {
        return event.target.classList.contains(service.serviceClass)
      });
      if (((cursorPosition.el === "submit") && !(cursorPosition.rendered)) || ((cursorPosition.el === "submit") && (cursorPosition.index !== this.currentCursorPosition.index))) {
        cursorPosition.rendered = true;
        this.currentCursorPosition = cursorPosition;
        this.setState({currentServiceClass: this.services[cursorPosition.index].serviceClass, btnClicked: false, hoverIndex: this.currentCursorPosition.index})
      }
    }
    else {
      this.clearServices();
    }
  }
  clearServices = () => {
    if ((!this.state.btnClicked) && (!(this.currentCursorPosition.el === null) || !(this.currentCursorPosition.index === null) || !(this.currentCursorPosition.rendered === false) || !(this.state.btnClicked === false) || !(this.state.currentServiceClass === null) || !(this.state.hoverIndex === null))){
      this.currentCursorPosition = {
        el: null,
        index: null,
        rendered: false
      };
      this.setState({currentServiceClass: null, hoverIndex: null, btnClicked: false})
    } 
  }
  serviceButtonClickedHandler = () => {
    let btnClicked = {...this.state.btnClicked};
    btnClicked = !this.state.btnClicked;
    this.setState({btnClicked: btnClicked});
  }
  serviceClickedHandler = (event) => {
    this.setState({ selectedService: event.target.id}
      , () => {
        this.serviceButtonClickedHandler(); 
        this.setState({hoverIndex:null});
        this.props.onRowAdd({serviceName: this.state.selectedService, index: 0});
      });
  }
  clickRemoveHandler = (event) => {
    if ((!event.target.hasAttribute("type")) && (this.state.btnClicked)) {
      this.currentCursorPosition = {
        el: null,
        index: null,
        rendered: false
      };
      this.setState({currentServiceClass: null, hoverIndex: null, btnClicked: false})
    }
  }

  render() {
    console.log('[App.js] render')
    return (
      <BrowserRouter>
        <Layout click = {this.clickRemoveHandler}>
          <Route path ='/' exact render={() => <h1>Home</h1>}/>
          <Route path ='/calculator' exact render={() => (
            <div 
            onMouseMove = {this.getElement} 
            onMouseLeave={this.clearServices} 
            className="menu">
            {this.services.map((service, index) => {
              return (
                <Btn 
                  click={this.serviceButtonClickedHandler}
                  serviceClass={service.serviceClass} 
                  index={index}
                  hover={this.state.hoverIndex}
                  currentClass={this.state.currentServiceClass}
                  serviceTitle={service.serviceTitle} 
                  key={service.serviceClass}
                  clicked={this.state.btnClicked}/>
              );
            })}
            <Services 
              showServices={this.state.btnClicked}
              click={this.serviceClickedHandler}
              index={this.currentCursorPosition.index}
              serviceClass = {this.state.currentServiceClass} 
              services={this.services}/>
              {this.props.inputRows[0]?<div className='input-rows'>
                {this.props.inputRows.map((service, index) => {
                  return <Input 
                    lastrow={index===this.props.inputRows.length-1?"last-row":""}
                    key={service.key} 
                    input={this.props.inputRows[index]}
                    inputRowsLength={this.props.inputRows.length}
                    inputRows={this.props.inputRows}
                    />})}</div>:null}
          </div>
          )}/>

        </Layout>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
      inputRows: state.inputs.inputRows
  };
};

const mapDispatchToPros = dispatch => {
  return {
    onRowAdd: (payload) => dispatch(actionCreators.addRow(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToPros)(App);


  
