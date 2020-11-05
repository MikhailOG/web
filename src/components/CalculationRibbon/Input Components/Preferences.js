import React, {useContext, useState, useEffect} from 'react'
import SelectComponent from '../Interface Components/SelectComponent'
import InputComponent from '../Interface Components/InputComponent'
import YesNoSelect from '../Interface Components/YesNoSelect'
import RowContext from '../../../context/row-context'
const Preferences = (props) => {
  const rowContext = useContext(RowContext);

  const [secondLineState, setSecondLineState] = useState({
    secondLine: null
  });
  const [styleState, setStyleState] = useState({
    style: {
      opacity: "0",
      maxHeight: "0"
    }
  })

  useEffect(() =>{
    if (props.showPreferences === true) {
      setStyleState({style: {opacity: "1", maxHeight: "15rem"}});
      setSecondLineState({secondLine:secondLine});
    }
    else {
      setStyleState({style: {opacity: "0", maxHeight: "15rem"}});
      setTimeout(
        () => {
          setSecondLineState({secondLine:null});
          setStyleState({style: {opacity: "0", maxHeight: "0"}});
        },
        150
      );
    }
  }, [props.showPreferences]);


  const secondLine = (
    <div style={styleState.style} className={"second-line"}>
        <SelectComponent id="material" values={rowContext.materials} value={rowContext.material}>Материал стены<br />(перекрытия)</SelectComponent>
        <SelectComponent id="job" values={rowContext.jobs} value={rowContext.job}>Вид работ:</SelectComponent>
        <YesNoSelect id="waste" answers={rowContext.wasteAnswers} selectedIndex={rowContext.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
        <InputComponent id="wasteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
        <InputComponent id="concreteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
        <YesNoSelect id="elevation" answers={rowContext.elevationAnswers} selectedIndex={rowContext.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
        <YesNoSelect id="water" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
    </div>);

  return (
      (props.showPreferences)?secondLine:secondLineState.secondLine
  );
}
export default Preferences;


{/* <div class="settings-check">
<p>Использовать как шаблон для следующих проемов</p>
<div class="settings-check-answers">
  <div class="settings-check-on">
    <i id="settings-check-on" class="settings-check-on far fa-circle"><p class="settings-check-on">да</p></i>
  </div>
  <div class="settings-check-off">
    <i id="settings-check-off" class="settings-check-off far fas fa-check-circle"><p class="settings-check-off">нет</p></i>
  </div>
</div>
</div> */}