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
    serviceList: null,
    hoverIndex: null,
    btnClicked: false
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
        this.getServices(cursorPosition.index)
        this.setState({currentServiceClass: this.services[cursorPosition.index].serviceClass, btnClicked: false, hoverIndex: this.currentCursorPosition.index})
      }
    }
    else {
      this.clearServices();
    }
  }
  clearServices = () => {
    if (!this.state.btnClicked){
      this.setState({currentServiceClass: null, serviceList: null, hoverIndex: null, btnClicked: false})
      this.currentCursorPosition = {
        el: null,
        index: null,
        rendered: false
      }
    } 
  }
  serviceClickedHandler = () => {
    let btnClicked = {...this.state.btnClicked};
    btnClicked = !this.state.btnClicked;
    this.setState({btnClicked: btnClicked});
  }
  getServices = (index) => {
    switch (this.services[index].serviceClass) {
      case "diamond-coring":
        this.setState({serviceList: <React.Fragment>
                                      <h3 type="service">Расчет нового проема</h3>
                                      <h3 type="service">Расчет расширения проема</h3>
                                      <h3 type="service">Расчет одиночных отверстий</h3>
                                    </React.Fragment>})
        break;
      case "diamond-saw":
        this.setState({serviceList: <React.Fragment>
                                      <h3 type="service">Расчет нового проема</h3>
                                      <h3 type="service">Расчет расширения проема</h3>
                                      <h3 type="service">Расчет по длине/площади резки</h3>
                                    </React.Fragment>});
        break;
      case "diamond-wire":
        this.setState({serviceList: <React.Fragment>
                                      <h3 type="service">Расчет нового проема</h3>
                                      <h3 type="service">Расчет по площади резки</h3>
                                    </React.Fragment>});
        break;
      case "enforcement":
        this.setState({serviceList: <React.Fragment>
                                      <h3 type="service">Усиление проема</h3>
                                      <h3 type="service">Обрамление проема</h3>
                                    </React.Fragment>});
        break;
      default:
          return null
    }
  }

  render() {
    return (
      <div className="web">
        <div className="grid-container">
          <Header title="Тепловые Линии Мск" titleText="Алмазная резка и алмазное бурение" telefone="+7 (926) 932 68 40"/>
          <Nav/>
        </div>
        <div className="main-container">
          <div onMouseMove = {(event) => this.getElement(event)} onMouseLeave={this.clearServices} className="menu">
            {this.services.map((service, index) => {
              return <Btn 
              click={this.serviceClickedHandler}
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
            serviceClass = {this.state.currentServiceClass} 
            serviceList={this.state.serviceList}/>
            <InputRows/>
          </div>


        </div>
      </div>

    );
  }
}
export default App;


  
