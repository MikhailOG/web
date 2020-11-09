import React, { useState, useContext, useEffect } from 'react'
import SelectComponent from '../Interface Components/SelectComponent'
import InputComponent from '../Interface Components/InputComponent'
import YesNoSelect from '../Interface Components/YesNoSelect'
import RowContext from '../../../context/row-context'
import Slider from '../../../hoc/Slider'
const Preferences = (props) => {
  const rowContext = useContext(RowContext);

  // const [contentState, setContentState] = useState({
  //   content: (
  //     <Slider show={props.showPreferences} maxHeight={props.maxHeight} classes="preferences" transitionTime={150}>
  //       <YesNoSelect id="waste" answers={rowContext.wasteAnswers} selectedIndex={rowContext.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
  //       <YesNoSelect id="elevation" answers={rowContext.elevationAnswers} selectedIndex={rowContext.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
  //       <YesNoSelect id="water" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
  //     </Slider>
  //   )
  // });

  // useEffect(()=>{     
  //     if (props.showPreferences) {
  //       setTimeout( 
  //         () => {
  //           setContentState({content: 
  //             <Slider show={props.showPreferences} maxHeight={props.maxHeight} classes="preferences" transitionTime={150}>
  //             <SelectComponent id="material" values={rowContext.materials} value={rowContext.material}>Материал стены<br />(перекрытия)</SelectComponent>
  //             <SelectComponent id="job" values={rowContext.jobs} value={rowContext.job}>Вид работ:</SelectComponent>
  //             <InputComponent id="wasteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
  //             <InputComponent id="concreteWeight">Плотность<br />материала, т/м3:</InputComponent>
  //             <YesNoSelect id="waste" answers={rowContext.wasteAnswers} selectedIndex={rowContext.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
  //             <YesNoSelect id="elevation" answers={rowContext.elevationAnswers} selectedIndex={rowContext.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
  //             <YesNoSelect id="water" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
  //           </Slider>
  //           });
  //       }, 1000);

  //     }
  //     else {
  //       setContentState({content: 
  //         <Slider show={props.showPreferences} maxHeight={props.maxHeight} classes="preferences" transitionTime={150}>
  //         <YesNoSelect id="waste" answers={rowContext.wasteAnswers} selectedIndex={rowContext.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
  //         <YesNoSelect id="elevation" answers={rowContext.elevationAnswers} selectedIndex={rowContext.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
  //         <YesNoSelect id="water" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
  //       </Slider>
  //       });
  //     }
  //   }, [props.showPreferences]);

  return (
    <Slider show={props.showPreferences} maxHeight={props.maxHeight} classes="preferences" transitionTime={150}>
      <SelectComponent id="material" values={rowContext.materials} value={rowContext.material}>Материал стены<br />(перекрытия)</SelectComponent>
      <SelectComponent id="job" values={rowContext.jobs} value={rowContext.job}>Вид работ:</SelectComponent>
      <InputComponent id="wasteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
      <InputComponent id="concreteWeight">Плотность<br />материала, т/м3:</InputComponent>
      <YesNoSelect id="waste" answers={rowContext.wasteAnswers} selectedIndex={rowContext.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
      <YesNoSelect id="elevation" answers={rowContext.elevationAnswers} selectedIndex={rowContext.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
      <YesNoSelect id="water" answers={rowContext.waterAnswers} selectedIndex={rowContext.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
    </Slider>
  );
}
export default Preferences;

// class Preferences extends Component {
//   static contextType = RowContext;
//   state= {
//     content: 
//       (<Slider show={this.props.showPreferences} maxHeight={this.props.maxHeight} classes="preferences" transitionTime={150}>
//           <YesNoSelect id="waste" answers={this.context.wasteAnswers} selectedIndex={this.context.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
//           <YesNoSelect id="elevation" answers={this.context.elevationAnswers} selectedIndex={this.context.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
//           <YesNoSelect id="water" answers={this.context.waterAnswers} selectedIndex={this.context.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
//       </Slider>)
//   }
 
//   addContentWithDelay = (delay) => {
//     setTimeout( 
//       () => {
//         this.setState({content: (
//           <Slider show={this.props.showPreferences} maxHeight={this.props.maxHeight} classes="preferences" transitionTime={150}>
//               <SelectComponent id="material" values={this.context.materials} value={this.context.material}>Материал стены<br />(перекрытия)</SelectComponent>
//               <SelectComponent id="job" values={this.context.jobs} value={this.context.job}>Вид работ:</SelectComponent>
//               <InputComponent id="wasteWeight">Разделить проем<br />на части весом<br />не более, кг:</InputComponent>
//               <InputComponent id="concreteWeight">Плотность<br />материала, т/м3:</InputComponent>
//               <YesNoSelect id="waste" answers={this.context.wasteAnswers} selectedIndex={this.context.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
//               <YesNoSelect id="elevation" answers={this.context.elevationAnswers} selectedIndex={this.context.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
//               <YesNoSelect id="water" answers={this.context.waterAnswers} selectedIndex={this.context.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
//         </Slider>)
//         });
//     }, delay);
//   }
//   removeContent = () => {
//     this.setState({content: (
//       <Slider show={this.props.showPreferences} maxHeight={this.props.maxHeight} classes="preferences" transitionTime={150}>
//           <YesNoSelect id="waste" answers={this.context.wasteAnswers} selectedIndex={this.context.wasteSelectedIndex}>Вынос мусора</YesNoSelect>
//           <YesNoSelect id="elevation" answers={this.context.elevationAnswers} selectedIndex={this.context.elevationSelectedIndex}>Проем на высоте<br />более 3 м от пола</YesNoSelect>
//           <YesNoSelect id="water" answers={this.context.waterAnswers} selectedIndex={this.context.waterSelectedIndex}>Требуется сбор воды<br />(помещение с отделкой)</YesNoSelect>
//     </Slider>)
//     });
//   }
//   componentDidMount() {
//     if (this.props.showPreferences)
//       this.addContentWithDelay(150);
//     else
//       this.removeContent();
//   }
//   render() {
//     console.log(this.state.content)
//     return(
//       this.props.showPreferences?this.state.content:null

//     );
//   }
// }
// export default Preferences;