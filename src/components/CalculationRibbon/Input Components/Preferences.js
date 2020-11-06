import React, { useContext } from 'react'
import SelectComponent from '../Interface Components/SelectComponent'
import InputComponent from '../Interface Components/InputComponent'
import YesNoSelect from '../Interface Components/YesNoSelect'
import RowContext from '../../../context/row-context'
import Slider from '../../../hoc/Slider'
const Preferences = (props) => {
  const rowContext = useContext(RowContext);

  return (
      <Slider show={props.showPreferences} maxHeight={props.maxHeight} classes="second-line" transitionTime={150}>
        <SelectComponent id="material" values={rowContext.materials} value={rowContext.material}>Материал стены<br />(перекрытия)</SelectComponent>
        <SelectComponent id="job" values={rowContext.jobs} value={rowContext.job}>Вид работ:</SelectComponent>
        <YesNoSelect id="waste" answers={rowContext.wasteAnswers} selectedIndex={rowContext.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
        <InputComponent id="wasteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
        <InputComponent id="concreteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
        <YesNoSelect id="elevation" answers={rowContext.elevationAnswers} selectedIndex={rowContext.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
        <YesNoSelect id="water" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
      </Slider>
  );
}
export default Preferences;

