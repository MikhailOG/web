import React, { Component,useState, useEffect } from 'react';
import Input from './Input';
import InputContext from '../../context/input-context';
//redux
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

class InputRows extends Component {

}
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
                mode: true,
                deleteButton: false
            }
        ],
        rowNum: 1
    });
    useEffect(()=>{     
            setInputState({
                input: [
                    {id: props.selectedService, index: 0, qty:1, mode: true, deleteButton: false}
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
                        if ((newInputState[index].qty === 0) && (newInputState[index].deleteButton === true)) newInputState[index].deleteButton = false;
                        newInputState[index].qty ++;
                        event.target.parentElement.querySelector("input").value = newInputState[index].qty;
                        break;
                        case 'subtractMode': 
                            if (((newInputState[index].qty === 1)&&(newInputState.length>1)) || ((newInputState[index].qty === 0)&&(newInputState[index].deleteButton === false))) {
                                newInputState[index].deleteButton = true;
                            }
                            if ((newInputState[index].qty > 1) || ((newInputState.length>1)&&(newInputState[index].qty === 1))) {
                            newInputState[index].qty --;
                            event.target.parentElement.querySelector("input").value = newInputState[index].qty;
                            }
                        break;
                        case 'onChangeMode':
                            if ((event.target.value >= 1) || ((event.target.value == 0)&&(newInputState.length>1)))
                            newInputState[index].qty = parseFloat(event.target.value);
                            else event.target.value = newInputState[index].qty;
                            if ((newInputState[index].qty >= 1) && (newInputState[index].deleteButton === true))
                                newInputState[index].deleteButton = false;
                            else if ((newInputState[index].qty === 0) && (newInputState[index].deleteButton === false) && (newInputState.length>1))
                                newInputState[index].deleteButton = true;
                        break;
                        default: window.alert("incorrect button mode");
                    }
                    setInputState({
                        input: newInputState,
                        rowNum: inputState.rowNum
                    })
                }
            },
            targetedQtyHandler: (mode, target) => {
                const input = target.parentElement.parentElement.parentElement.parentElement;
                if (input.hasAttributes('keyvalue')){
                    const index = keysState.keys.findIndex((key) => key === parseFloat(input.getAttribute('keyvalue')));
                    const newInputState = [...inputState.input];
                    switch (mode) {
                        case 'addMode': 
                        if ((newInputState[index].qty === 0) && (newInputState[index].deleteButton === true)) newInputState[index].deleteButton = false;
                        newInputState[index].qty ++;
                        target.parentElement.querySelector("input").value = newInputState[index].qty;
                        break;
                        case 'subtractMode': 
                            if (((newInputState[index].qty === 1)&&(newInputState.length>1)) || ((newInputState[index].qty === 0)&&(newInputState[index].deleteButton === false))) {
                                newInputState[index].deleteButton = true;
                            }
                            if ((newInputState[index].qty > 1) || ((newInputState.length>1)&&(newInputState[index].qty === 1))) {
                            newInputState[index].qty --;
                            target.parentElement.querySelector("input").value = newInputState[index].qty;
                            }
                        break;
                        // case 'onChangeMode':
                        //     if ((target.value >= 1) || ((target.value == 0)&&(newInputState.length>1)))
                        //     newInputState[index].qty = parseFloat(target.value);
                        //     else target.value = newInputState[index].qty;
                        //     if ((newInputState[index].qty >= 1) && (newInputState[index].deleteButton === true))
                        //         newInputState[index].deleteButton = false;
                        //     else if ((newInputState[index].qty === 0) && (newInputState[index].deleteButton === false) && (newInputState.length>1))
                        //         newInputState[index].deleteButton = true;
                        // break;
                        default: window.alert("incorrect button mode");
                    }
                    setInputState({
                        input: newInputState,
                        rowNum: inputState.rowNum
                    })
                }
            },
            addRowHandler: (event) => {
                const input = event.target.parentElement.parentElement.parentElement.parentElement;
                if (input.hasAttributes('keyvalue')){
                    const index = keysState.keys.findIndex((key) => key === parseFloat(input.getAttribute('keyvalue')));
                    const newInputState = [...inputState.input];
                    console.log(input);
                    newInputState.splice(index+1, 0, 
                        {
                            id:input.attributes.idvalue.value, 
                            // index: newIndex,
                            qty: 1,
                            mode: true,
                            deleteButton: false
                        });
                    setInputState({
                        input: newInputState,
                        rowNum: inputState.rowNum+1
                    });
                    let keys = [...keysState.keys];
                    keys.splice(index+1, 0, (Math.floor(1000000000000*Math.random()*Math.floor(Math.sqrt(Math.random()/Math.random()*100000000)))));
                    setKeysState({
                        keys: keys
                    });
                }
            },
            deleteRowHandler: (event) => {
                const input = event.target.parentElement.parentElement.parentElement;
                console.log("input: " + input);
                if (input.hasAttributes('keyvalue')){
                    const index = keysState.keys.findIndex((key) => key === parseFloat(input.getAttribute('keyvalue')));
                    const newInputState = [...inputState.input];
                    newInputState.splice(index, 1);
                    if ((newInputState.length === 1) && (newInputState[0].deleteButton === true)) {
                        newInputState[0].deleteButton = false;
                        if (newInputState[0].qty == 0)
                        newInputState[0].qty = 1;
                    }

                    setInputState({
                        input: newInputState,
                        rowNum: inputState.rowNum-1
                    });
                    let keys = [...keysState.keys];
                    keys.splice(index, 1);
                    setKeysState({
                        keys: keys
                    })
                }
            },
            hideRowHandler: (event) => {
                const input = event.target.parentElement.parentElement.parentElement.parentElement;
                if (input.hasAttributes('keyvalue')){
                    const index = keysState.keys.findIndex((key) => key === parseFloat(input.getAttribute('keyvalue')));
                    const newInputState = [...inputState.input];
                    newInputState[index].mode = !newInputState[index].mode;
                    setInputState({
                        input: newInputState,
                        rowNum: inputState.rowNum
                    })
                }
            },
            rowsQty: inputState.input.length 
        }}>
            <div className="input-rows">               
                {
                props.inputRows.map((service, index) => {
                    return <Input 
                            deleteButton={props.inputRows[index].deleteButton}
                            lastrow={index===props.inputRows.length-1?"last-row":""}
                            key={props.inputRows[index].key} 
                            keyvalue={props.inputRows[index].key} 
                            mode={props.inputRows[index].mode}
                            idvalue={service.id} 
                            indexvalue={props.inputRows[index].index} 
                            qty={props.inputRows[index].qty}
                            />;
                })
                }
            </div>
        </InputContext.Provider>
    );
}
const mapStateToProps = state => {
    return {
        inputRows: state.inputRows.inputRows, 
    };
};

const mapDispatchToPros = dispatch => {
    return {
        onRowAdd: (payload) => dispatch( actionCreators.addRow(payload) )
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(InputRows);