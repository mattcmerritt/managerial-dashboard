import React, { Component } from "react";
import './App.css';
import Navbar from './Navbar';
import FileUploader from "./FileUploader";
import GraphContainer from './GraphContainer';
import RecWindow from "./RecWindow";
import ProcessFlowGraph from "./ProcessFlowGraph";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  uploadFile() {
    var data = { content: "example" };

    fetch("http://localhost:9000/upload", {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })
  }

  UNSAFE_componentWillMount() {
    this.callAPI();
  }

  render() {
    // data that will be received from the python script, contains a list of
    // links to the graphs as well as a list of groups for organizing the links
    const graphData = {
      graphs: [
        {
          link: 'https://mikepmerritt.github.io/DashboardTesting/pie_chart.html',
          group: 'patient',
          hasRec: true,
          rec: "This is the recommendation for graph 1."
        },
        {
          link: 'https://mikepmerritt.github.io/DashboardTesting/pie_chart_actionable.html',
          group: 'patient',
          hasRec: true,
          rec: "This is the recommendation for graph 2. We have a lot to say here to make sure that the box can display all of this text. If it does not fit, it will be a problem. This is the recommendation for graph 2. We have a lot to say here to make sure that the box can display all of this text. If it does not fit, it will be a problem. This is the recommendation for graph 2. We have a lot to say here to make sure that the box can display all of this text. If it does not fit, it will be a problem."
        },
        {
          link: 'https://mikepmerritt.github.io/DashboardTesting/pillar_chart.html',
          group: 'patient',
          hasRec: false,
          rec: "This is the recommendation for graph 3."
        },
        {
          link: 'https://mikepmerritt.github.io/DashboardTesting/staff_highest_room.html',
          group: 'staff',
          hasRec: false,
          rec: "Nothing to add."
        },
        {
          link: 'https://mikepmerritt.github.io/DashboardTesting/staff_pie_chart.html',
          group: 'staff',
          hasRec: false,
          rec: "Nothing to add."
        },
        {
          link: 'https://mikepmerritt.github.io/DashboardTesting/staff_pillar_chart.html',
          group: 'staff',
          hasRec: false,
          rec: "Nothing to add."
        },
      ],
    }

    // arrays that will contain lists for all links in a category
    const patientData = [];
    const staffData = [];

    // categorizing each link
    let discardedLinks = 0;
    for (var i = 0; i < graphData.graphs.length; i++) {
      if (graphData.graphs[i].group === 'patient') {
        patientData.push(graphData.graphs[i]);
      }
      else if (graphData.graphs[i].group === 'staff') {
        staffData.push(graphData.graphs[i]);
      }
      else {
        discardedLinks++;
      }
    }
    console.log("Links not grouped: " + discardedLinks);

    return (
      <div className="App">
        <Navbar />
        <FileUploader />

        <GraphContainer groupName={"Patient Data"} data={patientData} />
        <GraphContainer groupName={"Staff Data"} data={staffData} />

        <RecWindow />

        <p className="App-intro">{this.state.apiResponse}</p>

        <ProcessFlowGraph />
      </div>
    );
  }
}

export default App;
