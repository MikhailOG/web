import React, { Component } from 'react';
import Input from './Input'
import InputContext from '../context/input-context'
const inputRows = (props) => {
    return ( 
        <InputContext.Provider value={{diameters:[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350]}}>
            <div className="input-rows">
                {(props.selectedService)?
                    <Input id={props.selectedService}/>:null}
            </div>
        </InputContext.Provider>
        );
}

// class InputRows extends Component{
//     state = {
//         elements: [],
//         rowsQty: null
//     }
//     addFirstRowHandler = (id) => {
//         if ((this.state.elements.length === 0) && !(id === null)) {
//             this.setState({
//                 elements: [id],
//                 rowsQty: 1
//             });

//         }
//     }
//     addRowHandler = () => {

//     }
//     render(){
//         this.addFirstRowHandler(this.props.selectedService);
//         return ( 
//             <InputContext.Provider value={{diameters:[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350]}}>
//                 <div className="input-rows">
//                     {(this.state.elements.length === 0)?null:
//                     this.state.elements.map(id => 
//                         <Input id={id}/>)}
//                 </div>
//             </InputContext.Provider>
//             );
//     }
// }

export default inputRows;