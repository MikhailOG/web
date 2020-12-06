import React, { Component } from 'react';
import Btn from '../Btn/Btn';
import Services from '../Btn/Services';
import Input from './Input';
import LayoutContext from '../../context/layout-context';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

class Calculator extends Component {
  state = {
    currentServiceClass: null,
    hoverIndex: null,
    btnClicked: false,
    selectedService: null
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
  static contextType = LayoutContext;
  componentDidMount() {
    console.log('[Calculator.js] componentDidMount');
  }
  componentDidUpdate() {
    if (this.context.clicked) {
      this.clickRemoveHandler(this.context.clickedEvt)
    }
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
  clickRemoveHandler = (clickedEvt) => {
    if ((!clickedEvt.hasAttribute("type")) && (this.state.btnClicked)) {
      this.currentCursorPosition = {
        el: null,
        index: null,
        rendered: false
      };
      this.setState({currentServiceClass: null, hoverIndex: null, btnClicked: false})
    }
  }

  render() {
    console.log('[Calculator.js] render')
    return (
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

export default connect(mapStateToProps, mapDispatchToPros)(Calculator);


  
