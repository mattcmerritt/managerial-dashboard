import React, { Component } from "react";
import './App.css';
import Navbar from './Navbar';
import DataInput from "./DataInput";

class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar />
        <DataInput group="patient" enabled={true}/>
        <div className="patientCharts" id="patientChartsDiv" style={{display: "flex"}}></div>
        <DataInput group="staff" enabled={false}/>
        <div className="staffCharts" id="staffChartsDiv" style={{display: "none"}}></div>
      </div>
    )
  }

}

export default App;
