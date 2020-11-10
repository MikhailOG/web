import React, {Component} from 'react';

import RowContext from '../../../context/row-context';
import UtilityContext from '../../../context/utility-context';
class Utilities extends Component {
    static contextType = RowContext;
    state = {
        classList: ['first-line'],
        content: this.props.normalLine
    }
    switchContentHandler = () => {

        let newState = {...this.state};
        if (!this.context.mode) {
            newState.content = this.props.normalLine;
            newState.classList = ['first-line', 'opacity-class'];
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
                newState.classList = ['first-line'];
                this.setState(newState);    
            }, 75);
        }
    }
 
    render() {

        return (
            <UtilityContext.Provider value={{
                switchContentHandler: this.switchContentHandler
                
            }}>
                <div className={this.state.classList.join(' ')}>
                    {this.state.content}
                </div>
            </UtilityContext.Provider>

        );
    }

}
export default Utilities;
// const firstLineModified = (
//     <div className="first-line opacity-class"> 
//         <Signs/>
//         <div className='text'>
//         <p>Новый проем {this.context.width}x{this.context.height}x{this.context.depth} - {this.context.qty} шт.</p> 
//         <p>Диаметр коронки {this.context.diameter} мм</p>
//         </div>
//         <DrawButton/>
//     </div>);



//     const firstLine = (
//         <div className="first-line"> 
//             <Signs/>
//             <InputComponent id="width">Ширина, мм:</InputComponent>
//             <InputComponent id="height">Высота, мм:</InputComponent>
//             <InputComponent id="depth">Глубина, мм:</InputComponent>
//             <SelectComponent id="diameter" values={this.context.diameters} value={this.context.diameter}>Диаметр коронки:</SelectComponent>
//             <Cog/>
//             <AddToCart/>
//             <DrawButton/>
//         </div>);