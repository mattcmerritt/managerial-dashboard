import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DatasetAdder from './DatasetAdder';

class AdditionalDataInput extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.viz = props.viz;

        this.addDataInput = this.addDataInput.bind(this);
    }

    componentDidMount() {

    }

    addDataInput() {
        const currentDisplay = document.getElementById(this.props.group + "InputSelect");
        currentDisplay.remove();

        const app = document.querySelector("div.App");
        const dataBox = document.createElement("div");
        dataBox.id = this.props.group + "AdditionalData";
        app.appendChild(dataBox);

        // need to add a chart div
        const chartDiv = document.createElement("div");
        chartDiv.id = this.props.group + "ChartsDiv";
        chartDiv.className = this.props.group + "Charts";
        app.appendChild(chartDiv);
        
        const loader = <DatasetAdder group={this.props.group} viz={this.viz} />;

        ReactDOM.render(loader, dataBox);
    }

    render() {
        return (
            <div className={this.props.group + "DataExport"}>
                <button onClick={this.addDataInput}>Add Next Dataset</button>
            </div>
        )
    }
}

export default AdditionalDataInput;