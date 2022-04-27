import React, { Component } from 'react';
import ChartContainer from './ChartContainer';
import ReactDOM from 'react-dom';

class DatasetAdder extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        
        this.group = props.group;
        this.viz = props.viz;
        this.XLSX = null;

        this.LoadNewDataset = this.LoadNewDataset.bind(this);
        this.ShowCharts = this.ShowCharts.bind(this);
    }

    componentDidMount() {
        this.XLSX = require("xlsx");
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
        if (this.state.newDataset !== undefined)
        {
            // grab old dataset
            let oldDataset = JSON.parse(sessionStorage.getItem(this.group + "Dataset"));

            const newDataset = [];

            // adding empty lists with connections and categories to new dataset
            for (const list of oldDataset) {
                list.data = [];
                newDataset.push(list);
            }

            // putting items into the proper lists
            for (const loadList of this.state.newDataset) {
                for (const list of newDataset) {
                    if (list.name === loadList.name) {
                        list.data = loadList.data;
                    }
                }
            }

            console.log(newDataset);

            // retrieving old dataset (was destroyed)
            oldDataset = JSON.parse(sessionStorage.getItem(this.group + "Dataset"));

            // saving datasets to storage
            let datasets = JSON.parse(sessionStorage.getItem(this.group + "Datasets"));
            if (datasets === null) {
                datasets = [oldDataset, newDataset];
            }
            else {
                datasets.push(newDataset);
            }
            sessionStorage.setItem(this.group + "Datasets", JSON.stringify(datasets));
            // overwrite current dataset with the newest
            sessionStorage.setItem(this.group + "Dataset", JSON.stringify(newDataset));

            // creating the charts for the newest dataset
            const charts = <ChartContainer group={this.group} viz={this.viz} />;
            const additionalDataDiv = document.getElementsByClassName(this.group + "AdditionalData")[0];
            const emptyDiv = document.createElement("div");
            additionalDataDiv.appendChild(emptyDiv);
            ReactDOM.render(charts, emptyDiv);

            // // removing this loader
            const parentDiv = document.getElementById(this.group + "DatasetLoader");
            parentDiv.remove();
        }
    }

    render() {
        return (
            <div id={this.group + "DatasetLoader"}>
                <div id={this.group + "LoaderNew"}>
                    <label htmlFor={this.group + "ReloadForm"}>Select new data to load: </label>
                    <input type="file" id={this.group + "ReloadForm"} onChange={this.LoadNewDataset} accept=".xlsx" />
                </div>
            </div>
        );
    }
}

export default DatasetAdder;