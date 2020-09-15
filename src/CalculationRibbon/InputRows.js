import React, { useState } from 'react';
import Input from './Input'
import InputContext from '../context/input-context'
const InputRows = (props) => {
    const [ inputState, setInputState] = useState({
        input: [
            {id: null, index: 0}
        ],
        rowNum: 0
    });
    
    
    // const addFirstRowHandler = (id) => {
    //     setInputState({
    //         input: [
    //             {id: id, index:0}
    //         ]
    //     })
    // }
    const addRowHandler = (event) => {
        setInputState({
            input: inputState.input.splice(event.target.attributes.indexvalue, 0, {id:event.target.parentElement.parentElement.parentElement.parentElement.attributes.idvalue, index: event.target.parentElement.parentElement.parentElement.parentElement.attributes.indexvalue+1}),
            rowNum: inputState.rowNum+1
        });
        console.log(inputState)
    }
    
    return (
        <InputContext.Provider value={{diameters:[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350]}}>
            <div className="input-rows">
                {(props.selectedService)?
                    <Input 
                    idvalue={props.selectedService}
                    indexvalue={0}
                    plus={addRowHandler}
                    />:null}
                {
                    (inputState.rowNum > 0)?
                    inputState.input.map(service => {
                        return(<Input idvalue={service.id} indexvalue={service.index} plus={addRowHandler}/>);
                    }):null
                }
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

export default InputRows;