import React, {Fragment, useContext} from 'react'
import InputComponent from '../Interface Components/InputComponent'
import SelectComponent from '../Interface Components/SelectComponent'
import AddToCart from '../Interface Components/AddToCart'
import DrawButton from '../Interface Components/DrawButton'
import Signs from '../Interface Components/Signs'
import Cog from '../Interface Components/Cog'
import InputContext from '../../context/input-context'

const EnhancementCoring = (props) => {
    const inputContext = useContext(InputContext);

    return (
        <Fragment>
            <div className="first-line"> 
                <Signs  plus={props.plus}/>
                <InputComponent id="width" default="500">Ширина, мм:</InputComponent>
                <InputComponent id="height" default="500">Высота, мм:</InputComponent>
                <InputComponent id="depth" default="250">Глубина, мм:</InputComponent>
                <SelectComponent id="diameter" default="152" values={inputContext.diameters}>Диаметр коронки:</SelectComponent>
                <Cog/>
                <AddToCart/>
                <DrawButton/>
            </div>
            <div className="second-line">
                <div className="input-enhancement">
                    <p>Насколько расширить проем?</p>
                    <div className="enhancement-sides">
                        <InputComponent id="enhancement-top" default="0">Сверху, мм:</InputComponent>
                        <InputComponent id="enhancement-bot" default="0">Снизу, мм:</InputComponent>
                        <InputComponent id="enhancement-left" default="0">Слева, мм:</InputComponent>
                        <InputComponent id="enhancement-right" default="0">Справа, мм:</InputComponent>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default EnhancementCoring;






