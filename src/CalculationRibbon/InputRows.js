import React, { Component } from 'react';
import Input from './Input'
import InputContext from '../context/input-context'
// const inputRows = (props) => {

// }

class InputRows extends Component{
    state = {
        elements: null,
        rowsQty: null
    }
    addFirstRowHandler = (id) => {
        if ((this.state.elements === null) && !(id===null)) {
            this.setState({
                elements: [id],
                rowsQty: 1
            });

        }
    }
    addRowHandler = () => {

    }
    render(){
        this.addFirstRowHandler(this.props.selectedService);
        return ( 
            <div className="input-rows">
                {(this.state.elements===null)?null:
                this.state.elements.map(id => <InputContext.Provider value={{diameters:[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350]}}>
                    <Input key={this.state.rowsQty} id={id}/></InputContext.Provider>)}
            </div>
            );
    }
}

export default InputRows;