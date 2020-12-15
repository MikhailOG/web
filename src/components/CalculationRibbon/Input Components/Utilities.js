import React, {Component} from 'react';

import RowContext from '../../../context/row-context';
import UtilityContext from '../../../context/utility-context';
class Utilities extends Component {
    static contextType = RowContext;
    state = {
        classList: ['utility-container'],
        content: this.props.normalLine
    }

    switchContentHandler = () => {
        let newState = {...this.state};
        if (!this.context.mode) {
            newState.content = this.props.normalLine;
            newState.classList = ['utility-container', 'opacity-class'];
        }
        else {
            newState.content = this.props.modifiedLine;
        }
        this.setState(newState);
    }
    componentDidUpdate() {
        if (this.state.classList[1]) {
            let newState = {...this.state};
            setTimeout(() => {
                newState.classList = ['utility-container'];
                this.setState(newState);    
            }, this.props.transitionTime);
        }
        if (!this.context.mode && this.state.content !== this.props.modifiedLine) {
            let newState = {...this.state};
            newState.content = this.props.modifiedLine;
            this.setState(newState); 
        }
    }
 
    render() {
        let height = {};
        this.context.mode?height=this.props.height:null;
        return (
            <UtilityContext.Provider value={{
                switchContentHandler: this.switchContentHandler
                
            }}>
                <div 
                style = {height}
                className={this.state.classList.join(' ')}
                >
                    {this.state.content}
                </div>
                {/* {!this.props.extraLine==0?<div className={this.state.classList.join(' ')}>
                    {this.props.extraLine}
                </div>:null} */}

            </UtilityContext.Provider>

        );
    }

}
export default Utilities;
// const firstLineModified = (
//     <div className="utility-container opacity-class"> 
//         <Signs/>
//         <div className='text'>
//         <p>Новый проем {this.context.width}x{this.context.height}x{this.context.depth} - {this.context.qty} шт.</p> 
//         <p>Диаметр коронки {this.context.diameter} мм</p>
//         </div>
//         <DrawButton/>
//     </div>);



//     const firstLine = (
//         <div className="utility-container"> 
//             <Signs/>
//             <InputComponent id="width">Ширина, мм:</InputComponent>
//             <InputComponent id="height">Высота, мм:</InputComponent>
//             <InputComponent id="depth">Глубина, мм:</InputComponent>
//             <SelectComponent id="diameter" values={this.context.diameters} value={this.context.diameter}>Диаметр коронки:</SelectComponent>
//             <Cog/>
//             <AddToCart/>
//             <DrawButton/>
//         </div>);