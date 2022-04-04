import React, { Component } from "react";
import './App.css';
import Navbar from './Navbar';
import DataInput from "./DataInput";

// viz
import Viz from 'viz.js';
import workerURL from 'viz.js/full.render.js';
// import GraphvizChart from "./GraphvizChart";

let viz = new Viz( workerURL );

class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar />
        <DataInput group="patient" enabled={true} viz={viz}/>
        <div className="patientCharts" id="patientChartsDiv" style={{display: "flex"}}></div>
        <DataInput group="staff" enabled={false} viz={viz}/>
        <div className="staffCharts" id="staffChartsDiv" style={{display: "none"}}></div>
        {/* <GraphvizChart src={"digraph { a -> b; }"} engine={"dot"} viz={viz} data="patient"/> */}
      </div>
    )
  }

}

export default App;
