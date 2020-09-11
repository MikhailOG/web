import React from 'react'
import InputComponent from './InputComponent'
import SelectComponent from './SelectComponent'
import AddToCart from './AddToCart'
import DrawButton from './DrawButton'
import Signs from './Signs'
const wld = () => {
    const diameterValues=[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350];

    return (
    <div className="first-line"> 
        <Signs/>
        <InputComponent id="width" default="500">Ширина, мм:</InputComponent>
        <InputComponent id="height" default="500">Высота, мм:</InputComponent>
        <InputComponent id="depth" default="250">Глубина, мм:</InputComponent>
        <SelectComponent id="diameter" default="152" values={diameterValues}>Диаметр коронки:</SelectComponent>
        <AddToCart/>
        <DrawButton/>
    </div>
    );
}
export default wld;