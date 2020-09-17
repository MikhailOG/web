import React, { Component } from 'react';
import './styles/App.css';
import Layout from './Layout/Layout';
import Btn from './Btn/Btn';
import Services from './Btn/Services';
import InputRows from './CalculationRibbon/InputRows';
class App extends Component {
  constructor(props) {
    super(props);
    console.log('[App.js] constructor');
  }
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
  static getDerivedStateFromProps(props, state) {
    console.log('[App.js] getDerivedStateFrom props', props);
    return state; 
  };
  componentDidMount() {
    console.log('[App.js] componentDidMount')
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
      }
      this.setState({currentServiceClass: null, hoverIndex: null, btnClicked: false})
    } 
  }
  serviceButtonClickedHandler = () => {
    let btnClicked = {...this.state.btnClicked};
    btnClicked = !this.state.btnClicked;
    this.setState({btnClicked: btnClicked});
  }
  serviceClickedHandler = (event) => {
    this.setState({ selectedService: event.target.id}, () => {this.serviceButtonClickedHandler(); this.setState({hoverIndex:null})});
  }
  render() {
    console.log('[App.js] render')
    return (
    <Layout>
      <div 
      onMouseMove = {this.getElement} 
      onMouseLeave={this.clearServices} 
      className="menu">
      {this.services.map((service, index) => {
        return <Btn 
        click={this.serviceButtonClickedHandler}
        serviceClass={service.serviceClass} 
        index={index}
        hover={this.state.hoverIndex}
        currentClass={this.state.currentServiceClass}
        serviceTitle={service.serviceTitle} 
        key={service.serviceClass}
        clicked={this.state.btnClicked}/>})}
        <Services 
        showServices={this.state.btnClicked}
        click={this.serviceClickedHandler}
        index={this.currentCursorPosition.index}
        serviceClass = {this.state.currentServiceClass} 
        services={this.services}/>
        {(this.state.selectedService)?<InputRows selectedService={this.state.selectedService}/>:null}
      </div>
    </Layout>
    );
  }
}
export default App;


  
