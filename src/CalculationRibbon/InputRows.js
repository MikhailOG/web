import React, { useState, useEffect } from 'react';
import Input from './Input'
import InputContext from '../context/input-context'
const InputRows = (props) => {
    const [keysState, setKeysState] = useState({
        keys: ['first-element']
    });
    const [ inputState, setInputState] = useState({
        input: [
            {key: null, id: props.selectedService, index: 0}
        ],
        rowNum: 1
    });
    useEffect(()=>{     
            setInputState({
                input: [
                    {key: keysState.keys[0], id: props.selectedService, index: 0}
                ],
                rowNum: 1
            });
    }, [props.selectedService]);
    // const keyGenerator = (id) => (id+" "+Math.sqrt(Math.random()*Math.random()*100));
    // const addFirstRowHandler = (id) => {
    //     setInputState({
    //         input: [
    //             {id: id, index:0}
    //         ]
    //     })
    // }
    const addRowHandler = (event) => {
        const newInputState = [...inputState.input];
        let newIndex = inputState.input[event.target.parentElement.parentElement.parentElement.parentElement.attributes.indexvalue.value].index;
        newIndex++;

        newInputState.splice(newIndex, 0, {id:event.target.parentElement.parentElement.parentElement.parentElement.attributes.idvalue.value, index: newIndex});
        // console.log(newInputState)
        setInputState({
            input: newInputState,
            rowNum: inputState.rowNum+1
        });
        let keys = [...keysState.keys];
        keys.push(100*Math.random()*Math.sqrt(Math.random()*Math.random()*100000000))
        setKeysState({
            keys: keys
        })
    }
    
    return (
        
        <InputContext.Provider value={{diameters:[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350]}}>
            <div className="input-rows">
                {/* {(props.selectedService)?
                    <Input 
                    key='first-element'
                    idvalue={props.selectedService}
                    indexvalue="0"
                    plus={addRowHandler}
                    />:null} */}
                
                    {
                    inputState.input.map((service, index) => {
                        return <Input key={keysState.keys[index]} idvalue={service.id} indexvalue={service.index} plus={addRowHandler}/>;
                    })
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