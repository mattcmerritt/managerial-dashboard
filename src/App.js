import React, { Component } from "react";
import './App.css';
import Navbar from './Navbar';
import FileUploader from "./FileUploader";
import GraphContainer from './GraphContainer';

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
    const rawGraphData = {
      links: [
        'https://mikepmerritt.github.io/DashboardTesting/pie_chart.html',
        'https://mikepmerritt.github.io/DashboardTesting/pie_chart_actionable.html',
        'https://mikepmerritt.github.io/DashboardTesting/pillar_chart.html',
        'https://mikepmerritt.github.io/DashboardTesting/staff_highest_room.html',
        'https://mikepmerritt.github.io/DashboardTesting/staff_pie_chart.html',
        'https://mikepmerritt.github.io/DashboardTesting/staff_pillar_chart.html',
      ],
      groups: [
        'patient',
        'patient',
        'patient',
        'staff',
        'staff',
        'staff',
      ]
    }

    // arrays that will contain lists for all links in a category
    const patientData = [];
    const staffData = [];

    // categorizing each link
    let discardedLinks = 0;
    for (var i = 0; i < rawGraphData.links.length; i++) {
      if (rawGraphData.groups[i] === 'patient') {
        patientData.push(rawGraphData.links[i]);
      }
      else if (rawGraphData.groups[i] === 'staff') {
        staffData.push(rawGraphData.links[i]);
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

        <GraphContainer groupName={"Patient Data"} links={patientData} />
        <GraphContainer groupName={"Staff Data"} links={staffData} />

        <p className="App-intro">{this.state.apiResponse}</p>
      </div>
    );

    /*
    // previous code
    const graphData = [
      {
        link: 'https://mikepmerritt.github.io/DashboardTesting/pie_chart.html',
        h: '525',
        w: '30%'
      },
      {
        link: 'https://mikepmerritt.github.io/DashboardTesting/pie_chart_actionable.html',
        h: '525',
        w: '30%'
      },
      {
        link: 'https://mikepmerritt.github.io/DashboardTesting/pillar_chart.html',
        h: '525',
        w: '30%'
      }
    ];

    return (
      <div className="App">
        <Navbar />

        <FileUploader />
        <p className="App-intro">{this.state.apiResponse}</p>

        <h1>Patient Related Data</h1>

        <h1>Staff Related Data</h1>

        <div className="content">
          <Graph link={graphData[0].link} h={graphData[0].h} w={graphData[0].w} />
          <Graph link={graphData[1].link} h={graphData[1].h} w={graphData[1].w} />
          <Graph link={graphData[2].link} h={graphData[2].h} w={graphData[2].w} />
          <Graph link={graphData[0].link} h={graphData[0].h} w={graphData[0].w} />
          <Graph link={graphData[1].link} h={graphData[1].h} w={graphData[1].w} />
          <Graph link={graphData[2].link} h={graphData[2].h} w={graphData[2].w} />
          <Graph link={graphData[0].link} h={graphData[0].h} w={graphData[0].w} />
          <Graph link={graphData[1].link} h={graphData[1].h} w={graphData[1].w} />
          <Graph link={graphData[2].link} h={graphData[2].h} w={graphData[2].w} />
        </div>
      </div>
    );
    */
  }
}

export default App;
