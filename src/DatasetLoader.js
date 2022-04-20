import React, { Component } from 'react';
import ChartContainer from './ChartContainer';
import ReactDOM from 'react-dom';

class DatasetLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        
        this.group = props.group;
        this.viz = props.viz;
        this.XLSX = null;

        this.LoadOldDataset = this.LoadOldDataset.bind(this);
        this.LoadNewDataset = this.LoadNewDataset.bind(this);
        this.ShowCharts = this.ShowCharts.bind(this);
    }

    componentDidMount() {
        this.XLSX = require("xlsx");
    }

    async LoadOldDataset(e) {
        let fileContents;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            fileContents = fileReader.result;

            console.log(fileContents);

            // removing the reloader
            const parentDiv = document.getElementById(this.group + "Reloader");
            parentDiv.remove();
            const datasetLoaded = document.getElementById(this.group + "Reloaded");
            datasetLoaded.style.display = "block";

            // storing dataset loaded from previous file
            const oldDataset = JSON.parse(fileContents);
            this.setState({startingDataset: oldDataset}, this.ShowCharts);
        }
        fileReader.readAsText(e.target.files[0]);
    }

    async LoadNewDataset(e) {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = this.XLSX.read(data);

        let worksheet = workbook.Sheets[workbook.SheetNames[0]];    // first sheet in workbook
        var range = this.XLSX.utils.decode_range(worksheet['!ref']);     // range of sheet

        let colLetter = 'A';
        const starterLetterValue = colLetter.charCodeAt(0);
        let colLetterValue = starterLetterValue;
        
        const additionalDataset = [];

        // https://www.npmjs.com/package/xlsx#working-with-the-workbook
        for(let currCol = 0; currCol <= range.e.c; currCol++) {
            // first cell in a column is the name, so fetch that separately
            let nameCell = worksheet[colLetter + 1];
            let name = (nameCell ? nameCell.v : undefined);

            // rest of the cells are values, so fetch and add to an array
            const dataArray = [];
            for(let currRow = 1; currRow < range.e.r; currRow++) {
                let dataCellAddress = colLetter + (currRow + 1);
                let dataCell = worksheet[dataCellAddress];
                let dataValue = (dataCell ? dataCell.v : undefined);
                if(dataValue != null) {
                    dataArray.push(dataValue);
                }
            }

            additionalDataset.push(
                {
                    name: name,
                    data: dataArray,
                }
            );

            colLetterValue++;
            colLetter = String.fromCharCode(colLetterValue);
        }

        this.setState({newDataset: additionalDataset}, this.ShowCharts);
    }

    async ShowCharts() {
        if (this.state.startingDataset !== undefined && this.state.newDataset !== undefined)
        {
            // merge datasets together
            const mergedDataset = this.state.startingDataset;

            for (const list of mergedDataset) {
                // find the list in the new dataset
                let additonalData;
                for (const newList of this.state.newDataset) {
                    if (newList.name === list.name) {
                        additonalData = newList.data;
                    }
                }

                // adding the new points to the end of what was already there
                for (const point of additonalData) {
                    list.data.push(point);
                }
            }

            // saving dataset to storage
            sessionStorage.setItem(this.group + "Dataset", JSON.stringify(mergedDataset));

            // creating the charts
            const charts = <ChartContainer group={this.group} viz={this.viz} />;
            const inputSelectDiv = document.getElementById(this.group + "InputSelect");
            const emptyDiv = document.createElement("div");
            inputSelectDiv.appendChild(emptyDiv);
            ReactDOM.render(charts, emptyDiv);

            // removing this loader
            const parentDiv = document.getElementById(this.group + "DatasetLoader");
            parentDiv.remove();
        }
    }

    render() {
        return (
            <div id={this.group + "DatasetLoader"}>
                <div id={this.group + "Reloader"}>
                    <label htmlFor={this.group + "ReloadForm"}>Select dataset to load: </label>
                    <input type="file" id={this.group + "ReloadForm"} onChange={this.LoadOldDataset} accept=".txt" />
                </div>
                <p id={this.group + "Reloaded"} style={{display: "none"}}>Previous dataset loaded!</p> 
                <div id={this.group + "LoaderNew"}>
                    <label htmlFor={this.group + "ReloadForm"}>Select new data to load: </label>
                    <input type="file" id={this.group + "ReloadForm"} onChange={this.LoadNewDataset} accept=".xlsx" />
                </div>
            </div>
        );
    }
}

export default DatasetLoader;