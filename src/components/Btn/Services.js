import React, {Fragment} from 'react';

const services = (props) => {
  console.log('[services.js] is rendering...')
  const getServices = (index) => {
      let serviceList = null;
      switch (props.services[index].serviceClass) {
        case "diamond-coring":
          serviceList = 
          <Fragment>
              <h3 onClick={props.click} id="newCoring" type="service">Расчет нового проема</h3>
              <h3 onClick={props.click} id="enhancementCoring" type="service">Расчет расширения проема</h3>
              <h3 onClick={props.click} id="singleCoring" type="service">Расчет одиночных отверстий</h3>
          </Fragment>         
          break;
        case "diamond-saw":
          serviceList = 
          <Fragment>
              <h3 onClick={props.click} id="newSaw" type="service">Расчет нового проема</h3>
              <h3 onClick={props.click} id="enhancementSaw" type="service">Расчет расширения проема</h3>
              <h3 onClick={props.click} id="definedValueSaw" type="service">Расчет по длине/площади резки</h3>
          </Fragment>
          break;
        case "diamond-wire":
          serviceList= 
          <Fragment>
              <h3 onClick={props.click} id="newWire" type="service">Расчет нового проема</h3>
              <h3 onClick={props.click} id="definedWire" type="service">Расчет по площади резки</h3>
          </Fragment>
          break;
        case "enforcement":
          serviceList= 
          <Fragment>
              <h3 onClick={props.click} id="fullEnforcement" type="service">Усиление проема</h3>
              <h3 onClick={props.click} id="lightEnforcement" type="service">Обрамление проема</h3>
          </Fragment>
          break;
        default:
            return null;
      }
      return(serviceList);
    }
  return ( 
              (props.serviceClass && props.showServices) ?
                  <div type="list"
                  className={props.serviceClass + " services"} >
                      {getServices(props.index)}
                  </div> : null
  );
}

export default services;