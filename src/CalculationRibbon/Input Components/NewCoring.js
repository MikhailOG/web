import React, {useContext} from 'react'
import InputComponent from '../Interface Components/InputComponent'
import SelectComponent from '../Interface Components/SelectComponent'
import AddToCart from '../Interface Components/AddToCart'
import DrawButton from '../Interface Components/DrawButton'
import Signs from '../Interface Components/Signs'
import Cog from '../Interface Components/Cog'
import InputContext from '../../context/input-context'

const NewCoring = () => {
    const inputContext = useContext(InputContext);
    return (
    <div className="first-line"> 
        <Signs/>
        <InputComponent id="width" default="500">Ширина, мм:</InputComponent>
        <InputComponent id="height" default="500">Высота, мм:</InputComponent>
        <InputComponent id="depth" default="250">Глубина, мм:</InputComponent>
        <SelectComponent id="diameter" default="152" values={inputContext.diameters}>Диаметр коронки:</SelectComponent>
        <Cog/>
        <AddToCart/>
        <DrawButton/>
    </div>
    );
}
export default NewCoring;