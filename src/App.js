import React, { Component } from 'react';
import './styles/App.css';
import Header from './Header/Header';
import Nav from './Nav/Nav';
import Btn from './Btn/Btn';
import Services from './Btn/Services';
import InputRows from './CalculationRibbon/InputRows';
class App extends Component {
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
        // this.getServices(cursorPosition.index)
        this.setState({currentServiceClass: this.services[cursorPosition.index].serviceClass, btnClicked: false, hoverIndex: this.currentCursorPosition.index})
      }
    }
    else {
      this.clearServices();
    }
  }
  clearServices = () => {
    if (!this.state.btnClicked){
      this.setState({currentServiceClass: null, hoverIndex: null, btnClicked: false})
      this.currentCursorPosition = {
        el: null,
        index: null,
        rendered: false
      }
    } 
  }
  serviceButtonClickedHandler = () => {
    let btnClicked = {...this.state.btnClicked};
    btnClicked = !this.state.btnClicked;
    this.setState({btnClicked: btnClicked});
  }
  serviceClickedHandler = (event) => {
    this.setState({ selectedService: event.target.id }, () => console.log(this.state.selectedService));
  }


  render() {
    return (
      <div className="web">
        <div className="grid-container">
          <Header title="Тепловые Линии Мск" titleText="Алмазная резка и алмазное бурение" telefone="+7 (926) 932 68 40"/>
          <Nav/>
        </div>
        <div className="main-container">
          <div onMouseMove = {this.getElement} onMouseLeave={this.clearServices} className="menu">
            {this.services.map((service, index) => {
              return <Btn 
              click={this.serviceButtonClickedHandler}
              serviceClass={service.serviceClass} 
              index={index}
              hover={this.state.hoverIndex}
              currentClass={this.state.currentServiceClass}
              serviceTitle={service.serviceTitle} 
              key={service.serviceClass}
              clicked={this.state.btnClicked}
              />
              })}
            <Services 
            click={this.serviceClickedHandler}
            index={this.currentCursorPosition.index}
            serviceClass = {this.state.currentServiceClass} 
            services={this.services}/>
            <InputRows
              selectedService={this.state.selectedService}
            />
          </div>


        </div>
      </div>

    );
  }
}
export default App;


  