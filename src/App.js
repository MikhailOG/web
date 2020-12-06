import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './styles/App.css';
import Layout from './Layout/Layout';
import Calculator from './components/CalculationRibbon/Calculator';


class App extends Component {

    render() {
        console.log('[App.js] render')
        return (
          <BrowserRouter>
            <Layout click = {this.clickRemoveHandler}>
                <Route path ='/' exact render={() => <h1>Home</h1>}/>
                <Route path ='/calculator' exact component={Calculator}/>
            </Layout>
          </BrowserRouter>
        );    
    }   
}
export default App;