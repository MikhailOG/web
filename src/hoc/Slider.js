import React, {useState, useEffect} from 'react'


const Slider = (props) => {
  const [lineState, setLineState] = useState({
    slidingDiv: null
  });
  const [styleState, setStyleState] = useState({
    style: {
      opacity: "0",
      maxHeight: "0"
    }
  })

  useEffect(() =>{
    if (props.show) {
      setStyleState({style: {opacity: "1", maxHeight: props.maxHeight}});
      setLineState({slidingDiv:slidingDiv});
    }
    else {
      setStyleState({style: {opacity: "0", maxHeight: props.maxHeight}});
      setTimeout(
        () => {
          setLineState({slidingDiv:null});
          setStyleState({style: {opacity: "0", maxHeight: "0"}});
        },
        props.transitionTime
      );
    }
  }, [props.show]);


  const slidingDiv = (
    <div style={styleState.style} className={props.classes}>
        {props.children}
    </div>);

  return (
      (props.show)?slidingDiv:lineState.slidingDiv
  );
}
export default Slider;


// import React, { Component } from 'react'


// class Slider extends Component {
//     state = {
//         slidingDiv: null,
//         style: {
//             opacity: "0",
//             maxHeight: "0"
//           }
//     }


// componentWillReceiveProps() {

//         if (this.props.show) {
//             this.setState({
//                 slidingDiv: (
//                     <div style={this.state.style} className={this.props.classes}>
//                         {this.props.children}
//                     </div>),
//                 style: {opacity: "1", maxHeight: this.props.maxHeight}
//             });
//         }
//         else {
//             this.setState({
//                 style: {opacity: "0", maxHeight: this.props.maxHeight}
//             }, () => {            setTimeout(
//                 () => {
//                 this.setState({
//                     slidingDiv: null,
//                     style: {opacity: "0", maxHeight: "0"}});
//                 },
//                 this.props.transitionTime
//             );});

//         }

//     };
//     render() {

        
//         return (
//             this.state.slidingDiv
//         );
//     }
// }
// export default Slider;