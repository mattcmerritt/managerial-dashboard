import React, { Component } from 'react';
import ChartContainer from './ChartContainer';
import ReactDOM from 'react-dom';

class DatasetLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        
        this.group = props.group;
        this.viz = props.viz;

        this.LoadFile = this.LoadFile.bind(this);
    }

    async LoadFile(e) {
        let fileContents;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            fileContents = fileReader.result;

            console.log(fileContents);

            // removing the reloader
            const parentDiv = document.getElementById(this.group + "DatasetReloader");
            parentDiv.remove();

            // saving dataset to storage
            sessionStorage.setItem(this.group + "Dataset", fileContents);

            // creating the charts
            const charts = <ChartContainer group={this.group} viz={this.viz} />;
            const inputSelectDiv = document.getElementById(this.group + "InputSelect");
            const emptyDiv = document.createElement("div");
            inputSelectDiv.appendChild(emptyDiv);
            ReactDOM.render(charts, emptyDiv);
        }
        fileReader.readAsText(e.target.files[0]);
    }

    render() {
        return (
            <div id={this.group + "DatasetReloader"}>
                <label htmlFor={this.group + "ReloadForm"}>Select dataset to load: </label>
                <input type="file" id={this.group + "ReloadForm"} onChange={this.LoadFile} accept=".txt" />
            </div>
        );
    }
}

export default DatasetLoader;