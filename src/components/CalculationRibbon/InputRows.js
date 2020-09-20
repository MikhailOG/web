import React, { useState, useEffect } from 'react';
import Input from './Input'
import InputContext from '../../context/input-context'
const InputRows = (props) => {
    const [keysState, setKeysState] = useState({
        keys: [1]
    });
    const [ inputState, setInputState] = useState({
        input: [
            {
                id: props.selectedService, 
                index: 0, 
                qty:1, 
            }
        ],
        rowNum: 1
    });
    useEffect(()=>{     
            setInputState({
                input: [
                    {id: props.selectedService, index: 0, qty:1}
                ],
                rowNum: 1
            });
    }, [props.selectedService]);

    return (
        <InputContext.Provider value={{
            qtyHandler: (mode, event) => {
                const input = event.target.parentElement.parentElement.parentElement.parentElement;
                if (input.hasAttributes('keyvalue')){
                    const index = keysState.keys.findIndex((key) => key === parseFloat(input.getAttribute('keyvalue')));
                    const newInputState = [...inputState.input];
                    switch (mode) {
                        case 'addMode': 
                        newInputState[index].qty ++;
                        event.target.parentElement.querySelector("input").value = newInputState[index].qty;
                        break;
                        case 'subtractMode': 
                            if (newInputState[index].qty >1) {
                                newInputState[index].qty --;
                                event.target.parentElement.querySelector("input").value = newInputState[index].qty;
                            }
                        break;
                        default: window.alert("incorrect button mode");
                    }
                    setInputState({
                        input: newInputState,
                        rowNum: inputState.rowNum
                    })
                }
            },
            subtractQtyHandler: (event) => {
                const input = event.target.parentElement.parentElement.parentElement.parentElement;
                if (input.hasAttributes('keyvalue')){
                    const index = keysState.keys.findIndex((key) => key === parseFloat(input.getAttribute('keyvalue')));
                    const newInputState = [...inputState.input];
                    newInputState[index].qty ++;
                    setInputState({
                        input: newInputState,
                        rowNum: inputState.rowNum
                    })
                }
            },
            addRowHandler: (event) => {
                const input = event.target.parentElement.parentElement.parentElement.parentElement;
                const newInputState = [...inputState.input];
                let newIndex = inputState.input[input.attributes.indexvalue.value].index;
                newIndex++;
                newInputState.splice(newIndex, 0, 
                    {
                        id:input.attributes.idvalue.value, 
                        index: newIndex,
                        qty: 1,
                    });
                setInputState({
                    input: newInputState,
                    rowNum: inputState.rowNum+1
                });
                let keys = [...keysState.keys];
                keys.push(Math.floor(1000000000000*Math.random()*Math.floor(Math.sqrt(Math.random()/Math.random()*100000000))))
                setKeysState({
                    keys: keys
                })
            },
            hideRowHandler: (event) => {
                const input = event.target.parentElement.parentElement.parentElement.parentElement;
                console.log(input);
            }
        }}>
            <div className="input-rows">               
                    {
                    inputState.input.map((service, index) => {
                        return <Input 
                                key={keysState.keys[index]} 
                                keyvalue={keysState.keys[index]} 
                                idvalue={service.id} 
                                indexvalue={service.index} 
                                />;
                    })
                }
            </div>
        </InputContext.Provider>
    );
}

export default InputRows;