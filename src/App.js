import React, { Component } from "react";
import './App.css';
import Navbar from './Navbar';

// viz
import Viz from 'viz.js';
import workerURL from 'viz.js/full.render.js';
import InputSelection from "./InputSelection";

let viz = new Viz( workerURL );

class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar />

        <InputSelection group="patient" enabled={true} viz={viz} />
        <InputSelection group="staff" enabled={false} viz={viz} />
        <InputSelection group="staffCompare" enabled={false} viz={viz} />
      </div>
    )
  }

}

export default App;
