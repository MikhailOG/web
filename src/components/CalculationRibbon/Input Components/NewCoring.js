import React, {useContext} from 'react'
import InputComponent from '../Interface Components/InputComponent'
import SelectComponent from '../Interface Components/SelectComponent'
import AddToCart from '../Interface Components/AddToCart'
import DrawButton from '../Interface Components/DrawButton'
import Signs from '../Interface Components/Signs'
import Cog from '../Interface Components/Cog'
import RowContext from '../../../context/row-context'
const NewCoring = () => {
    const rowContext = useContext(RowContext);
    const firstLineModified = (
    <div className="first-line"> 
        <Signs/>
        <div className='text'>
        <p>Новый проем {rowContext.width}x{rowContext.height}x{rowContext.depth} - {rowContext.qty} шт.</p> 
        <p>Диаметр коронки {rowContext.diameter} мм</p>
        </div>
        <DrawButton/>
    </div>);
    const firstLine = (
        <div className="first-line"> 
            <Signs/>
            <InputComponent id="width">Ширина, мм:</InputComponent>
            <InputComponent id="height">Высота, мм:</InputComponent>
            <InputComponent id="depth">Глубина, мм:</InputComponent>
            <SelectComponent id="diameter" values={rowContext.diameters} value={rowContext.diameter}>Диаметр коронки:</SelectComponent>
            <Cog/>
            <AddToCart/>
            <DrawButton/>
        </div>);

    return (
        (rowContext.mode)?firstLine:firstLineModified
    );
}
export default NewCoring;