import React, {useContext} from 'react'
import SelectComponent from '../Interface Components/SelectComponent'
import InputComponent from '../Interface Components/InputComponent'
import YesNoSelect from '../Interface Components/YesNoSelect'
import RowContext from '../../../context/row-context'
const Preferences = () => {
    const rowContext = useContext(RowContext);

    const secondLine = (
    <div className="second-line">
        <SelectComponent id="material" values={rowContext.materials} value={rowContext.material}>Материал стены<br />(перекрытия)</SelectComponent>
        <SelectComponent id="job" values={rowContext.jobs} value={rowContext.job}>Вид работ:</SelectComponent>
        <YesNoSelect id="waste" answers={rowContext.wasteAnswers} selectedIndex={rowContext.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
        <InputComponent id="wasteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
        <InputComponent id="concreteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
        <YesNoSelect id="elevation" answers={rowContext.elevationAnswers} selectedIndex={rowContext.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
        <YesNoSelect id="water" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
        {/* <YesNoSelect id="preferences" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Вынос мусора</YesNoSelect> */}
    </div>);

    return (
        (rowContext.showPreferences)?secondLine:null
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