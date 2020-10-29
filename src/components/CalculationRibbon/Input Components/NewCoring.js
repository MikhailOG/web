import React, {useContext} from 'react'
import InputComponent from '../Interface Components/InputComponent'
import SelectComponent from '../Interface Components/SelectComponent'
import AddToCart from '../Interface Components/AddToCart'
import DrawButton from '../Interface Components/DrawButton'
import Signs from '../Interface Components/Signs'
import Cog from '../Interface Components/Cog'
import RowContext from '../../../context/row-context'
const NewCoring = (props) => {
    const rowContext = useContext(RowContext);
    const firstLineModified = (
    <div className="first-line"> 
        <Signs/>
        <p>Новый проем {props.width}x{props.height}x{props.depth} - {props.qty} шт. Диаметр коронки {props.diameter} мм</p>
        <Cog/>
        <AddToCart/>
        <DrawButton/>
    </div>);
    const firstLine = (
        <div className="first-line"> 
            <Signs/>
            <InputComponent id="width">Ширина, мм:</InputComponent>
            <InputComponent id="height">Высота, мм:</InputComponent>
            <InputComponent id="depth">Глубина, мм:</InputComponent>
            <SelectComponent id="diameter" values={rowContext.diameters}>Диаметр коронки:</SelectComponent>
            <Cog/>
            <AddToCart/>
            <DrawButton/>
        </div>);

    return (
        (props.mode)?firstLine:firstLineModified
    );
}
export default NewCoring;