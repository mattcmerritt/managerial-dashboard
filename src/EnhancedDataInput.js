import React, { Component } from 'react';

class EnhancedDataInput extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.XLSX = null;

        // binding functions to class
        this.ProcessDataset = this.ProcessDataset.bind(this);
        this.SelectSteps = this.SelectSteps.bind(this);
        this.ClassifySteps = this.ClassifySteps.bind(this);
        this.PerformStep = this.PerformStep.bind(this);
        this.ContinueProcess = this.ContinueProcess.bind(this);
        this.TerminateProcess = this.TerminateProcess.bind(this);
    }

    componentDidMount() {
        this.XLSX = require("xlsx");
    }

    // loading in the file
    // returns a workbook
    async LoadFile(e) {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = this.XLSX.read(data);

        return workbook;
    }

    // reading in the contents of the file as an object with arrays
    // returns a dataset
    async ExtractData(workbook) {
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];    // first sheet in workbook
        var range = this.XLSX.utils.decode_range(worksheet['!ref']);     // range of sheet

        let colLetter = 'A';
        const starterLetterValue = colLetter.charCodeAt(0);
        let colLetterValue = starterLetterValue;
        
        let dataset = [];

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
                dataArray.push(dataValue);
            }

            dataset.push(
                {
                    name: name,
                    data: dataArray,
                }
            );

            colLetterValue++;
            colLetter = String.fromCharCode(colLetterValue);
        }

        return dataset;
    }

    // ---------- The code below is the steps of the data loading process ----------
    // ---------- To add more, write new functions and add to steps array ----------

    // allow the user to remove fields that are not part of the process (like ID)
    // saves edited dataset
    async SelectSteps(dataset) {
        console.log("Selecting steps");
        // TODO: reimplement selecting steps with the checkboxes
        // saving dataset for next step in the process
        this.setState({dataset: dataset});
    }

    // allowing the user to choose categories for each step
    // saves edited dataset
    async ClassifySteps(dataset) {
        console.log("Classifying steps");
        // TODO: reimplement classifications with dropdown selections
        // saving dataset for next step in the process
        this.setState({dataset: dataset});
    }

    // method that ends the chain of method calls in the process
    async TerminateProcess() {
        console.log("Process completed!");
        // remove the button
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");
        parentDiv.remove();

        // TODO: create the graphs
    }

    // starting the loading process
    // returns nothing
    async ProcessDataset(e) {
        // removing the form component once changed
        console.log(this);
        const form = document.getElementById(this.props.group + "DataInForm");
        form.remove();

        // starting the process by loading the file to a workbook
        const workbook = await this.LoadFile(e);

        // extracting the data from the workbook
        const initialDataset = await this.ExtractData(workbook);

        // once dataset has been loaded, begin the data load process
        // steps should be put into an array so we can chain them together
        // must end in TerminateProcess
        this.setState(
            {
                current: 0, 
                steps: [this.SelectSteps, this.ClassifySteps, this.TerminateProcess], 
                dataset: initialDataset
            }
        );

        this.PerformStep(initialDataset);

        const nextButton = document.createElement("button");
        nextButton.onclick = this.ContinueProcess;
        nextButton.innerHTML = "Continue";
        
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");
        parentDiv.appendChild(nextButton);

        parentDiv.style.display = "block";
    }

    // returns the dataset after performing the given step
    // starts off the process of loading the data
    async PerformStep(dataset) {
        // call the function for the start step
        this.state.steps[this.state.current]();
    }

    // increment the current step, and perform the next step
    // returns the result of the next step
    // this should eventually read the 
    async ContinueProcess() {
        this.setState({current: this.state.current + 1});
        this.PerformStep(this.state.dataset);
    }

    render() {
        return (
            <div className={this.props.group + "DataIn"} style={this.props.enabled ? {display : "block"} : {display: "none"}}>
                <input type="file" id={this.props.group + "DataInForm"} onChange={this.ProcessDataset}></input>
                <div className={this.props.group + "DataInSettings"} id={this.props.group + "DataInSettings"} style={{display: "none"}}>
                    <p id={this.props.group + "InputInstructions"}>
                        Data was successfully loaded! Check all steps that should be processed as steps of the process.
                    </p>
                </div>
            </div>
        );
    }
}

export default EnhancedDataInput;