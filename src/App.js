import React, { Component } from "react";
import './App.css';
import Navbar from './Navbar';
import FileUploader from "./FileUploader";
import Graph from './Graph';

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
  }
}

export default App;
