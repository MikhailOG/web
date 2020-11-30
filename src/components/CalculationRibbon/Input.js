import React from 'react'
import Utilities from './Input Components/Utilities'
import InputComponent from './Interface Components/InputComponent'
import SelectComponent from './Interface Components/SelectComponent'
import AddToCart from './Interface Components/AddToCart'
import DrawButton from './Interface Components/DrawButton'
import Signs from './Interface Components/Signs'
import Cog from './Interface Components/Cog'
import RowContext from '../../context/row-context'
import Preferences from './Input Components/Preferences'
import { connect } from 'react-redux';

const Input = (props) => {

    // const [rowState, setRowState] = useState({

    //     material: "reinforced-concrete",
    //     job: "wall",
    //     waste: ["waste-off", 0],
    //     elevation: ["elevation-under-limit", 1],
    //     water: ["water-off", 1],
    //     showPreferences: false,
    //     wasteWeight: 100,
    //     concreteWeight: 2.4
    // });
    const rowContext = {
        diameters:[[42, '42 мм'], [52, '52 мм'], [62, '62 мм'], [72, '72 мм'], [82, '82 мм'], [92, '92 мм'], [102, '102 мм'], [112, '112 мм'], [122, '122 мм'], [132, '132 мм'], [142, '142 мм'], [152, '152 мм'], [162, '162 мм'], [172, '172 мм'], [182, '182 мм'], [192, '192 мм'], [200, '200 мм'], [250, '250 мм'], [300, '300 мм'], [350, '350 мм']]
    };

    // useEffect(() => {
    //     if ((!props.input.mode) && (rowState.showPreferences)) {
    //         let newRowState = {...rowState};
    //         newRowState.showPreferences = false;
    //         setRowstate(newRowState);
    //     }
    // }, [props.input.mode]) //moved to Signs.js


    let inputData = {};
    const input = (serviceName) => {
        switch (serviceName){
            case 'newCoring':
                inputData ={
                    normalLine: (
                        <React.Fragment> 
                            <Signs/>
                            <InputComponent id="width">Ширина, мм:</InputComponent>
                            <InputComponent id="height">Высота, мм:</InputComponent>
                            <InputComponent id="depth">Глубина, мм:</InputComponent>
                            <SelectComponent id="diameter" values={rowContext.diameters}>Диаметр коронки:</SelectComponent>
                            <Cog/>
                            <AddToCart/>
                            <DrawButton/>
                        </React.Fragment>
                    ), 
                    modifiedLine: (
                        <React.Fragment> 
                            <Signs/>
                            <div className='text'>
                            <p>Новый проем {props.input.data.width}x{props.input.data.height}x{props.input.data.depth} - {props.input.data.qty} шт.</p> 
                            <p>Диаметр коронки {props.input.data.diameter} мм</p>
                            </div>
                            <DrawButton/>
                        </React.Fragment>
                    ),
                    jobs: [['wall', 'проем в стене'], ['floor', 'проем в перекрытии']]
                }
                break;
            // case 'newCoring':
            //    inputData = {
            //         input: <NewCoring/>,
            //         jobs: [['wall', 'проем в стене'], ['floor', 'проем в перекрытии']]};
            // break;
            default: ;
        };
        return(inputData);
        }
        
    
    const mainClass = props.input.mode?"input":"input-mod";
    return(
        <div keyvalue={props.input.key} idvalue={props.idvalue} indexvalue={props.input.index} className={mainClass + " " + props.lastrow}>
            <RowContext.Provider value={{
                
                materials:[["reinforced-concrete", "железобетон"], ["concrete", "бетон"], ["brick", "кирпич"]],
                wasteAnswers:[["waste-off", "вручную"], ["waste-on", "погрузчиком"]],
                wasteSelectedIndex: props.input.preferences.waste[1],
                elevationAnswers:[["elevation-over-limit", " да"], ["elevation-under-limit", " нет"]],
                elevationSelectedIndex: props.input.preferences.elevation[1],
                waterAnswers:[["water-on", " да"], ["water-off", " нет"]],
                waterSelectedIndex: props.input.preferences.water[1],
                jobs: input(props.input.serviceName).jobs,
                width: props.input.data.width,
                height: props.input.data.height,
                depth: props.input.data.depth,
                diameter: props.input.data.diameter,
                material: props.input.preferences.material,
                job: props.input.preferences.job,
                wasteWeight: props.input.preferences.wasteWeight,
                concreteWeight: props.input.preferences.concreteWeight,
                qty: props.input.data.qty,
                mode: props.input.mode,
                deleteButton: props.input.deleteButton,
                inputChangedHandler: (event) => {
                    const id = event.target.getAttribute('id');
                    //let newRowState = {...rowState};

                    if (event.target.type === "select-one") {
                        console.log("id: " + id);
                        //console.log("prev value: " + newRowState[id]);
                        console.log("new value: " + event.target.value);
                        newRowState[id] = event.target.value;
                    }
                    else if ((event.target.type === "text") && (!isNaN(event.target.value) && (event.target.value > 0))){
                        newRowState[id] = event.target.value;
                    }
                    setRowState(newRowState);
                },
                yesNoSelectChangedHandler: (event, index) => {
                    const id = event.currentTarget.parentElement.classList[0];
                    const uniqueId = event.currentTarget.getAttribute('id');
                        if (!(rowState[id][0]===uniqueId)) { 
                            let newRowState = {...rowState};
                            newRowState[id][0] = uniqueId;
                            newRowState[id][1] = index;
                            setRowState(newRowState);
                        }
                },
                gearHandler: () => {
                    let newRowState = {...rowState};
                    newRowState.showPreferences = !newRowState.showPreferences;
                    setRowState(newRowState);
                },
                togglePreferencesHandle: () => {
                    if ((rowState.showPreferences) && (!rowState.mode)) {
                        let newRowState = {...rowState};
                        newRowState.showPreferences = !newRowState.showPreferences;
                        setRowState(newRowState);
                    }
                }
            }}>
                <Utilities 
                    normalLine={input(props.input.serviceName).normalLine}
                    modifiedLine={input(props.input.serviceName).modifiedLine}
                />
                <Preferences showPreferences={rowState.showPreferences} maxHeight="15rem"/>
            </RowContext.Provider>
        </div>
    );

}

const mapStateToProps = state => {
    return {
       // input: state.inputs.inputRows[Input.props.input.indexs]
    };
  };
  
  const mapDispatchToPros = dispatch => {
    return {
     // onRowAdd: (payload) => dispatch( actionCreators.addRow(payload) )
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToPros)(Input);