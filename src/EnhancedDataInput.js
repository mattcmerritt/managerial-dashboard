import React, { Component } from 'react';

class EnhancedDataInput extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.XLSX = null;

        // binding functions to class
        this.ProcessDataset = this.ProcessDataset.bind(this);
        this.SelectSteps = this.SelectSteps.bind(this);
        this.RemoveUnchecked = this.RemoveUnchecked.bind(this);
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
    // button will need to be pressed to get to next step
    async SelectSteps(dataset) {
        // TODO: reimplement selecting steps with the checkboxes
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");

        // step 1: remove unecessary columns from the dataset
        const fieldList = document.createElement("ul");
        fieldList.id = "outerList";
        fieldList.style = "list-style: none";

        // creating a parent checkbox to mark all as checked
        const allFields = document.createElement("li");
        const allCheckbox = document.createElement("input");
        allCheckbox.type = "checkbox";
        allCheckbox.id = "allFields";

        const allLabel = document.createElement("label");
        allLabel.for = "allFields";
        allLabel.innerHTML = "Fields Found:";

        allFields.appendChild(allCheckbox);
        allFields.appendChild(allLabel);
        fieldList.appendChild(allFields);

        // creating an inner list to have the child checkboxes
        const innerList = document.createElement("ul");
        innerList.id = "fieldList";
        innerList.style = "list-style: none";

        for (let list of dataset) {
            // building out the checkboxes
            const item = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = list.name;

            const label = document.createElement("label");
            label.for = list.name;
            label.innerHTML = `${list.name} (${list.data.length} data points)`;

            // putting the components into a list item and adding that item to the list
            item.appendChild(checkbox);
            item.appendChild(label);
            innerList.appendChild(item);
        }

        // putting the lists into the div
        fieldList.appendChild(innerList);
        parentDiv.appendChild(fieldList);

        let boxesChecked = 0; // number of boxes checked

        // making the parent checkbox check all of the child checkboxes
        allCheckbox.addEventListener("click", (e) => {
            const newState = document.querySelector(`#outerList input[id="allFields"]`).checked;

            for (let list of dataset) {
                const checkbox = document.querySelector(`#fieldList input[id="${list.name}"]`);
                checkbox.checked = newState;
            }

            boxesChecked = newState ? dataset.length : 0;
        });

        // adding listeners to each child checkbox to make them uncheck the parent if unchecked
        for (let list of dataset) {
            const checkbox = document.querySelector(`#fieldList input[id="${list.name}"]`);

            checkbox.addEventListener("click", () => {
                const newState = checkbox.checked;

                const parentBox = document.querySelector(`#outerList input[id="allFields"]`);
                if (newState) {
                    if (boxesChecked === 0) {
                        // change parent to indeterminate
                        parentBox.checked = false;
                        parentBox.indeterminate = true;
                    }
                    boxesChecked++;
                    if (boxesChecked === dataset.length) {
                        // check parent
                        parentBox.indeterminate = false;
                        parentBox.checked = true;
                    }
                } else {
                    boxesChecked--;
                    parentBox.indeterminate = true;
                    parentBox.checked = false;
                    if (boxesChecked === 0) {
                        // uncheck parent
                        parentBox.indeterminate = false;
                        parentBox.checked = false;
                    }
                }
            });
        }

        // saving dataset for next step in the process
        this.setState({dataset: dataset});
    }

    // based on the checkboxes, remove the fields that are not checked from the dataset
    // saves edited dataset
    // should start next step without button
    async RemoveUnchecked(dataset) {
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");

        // reading checkmarks and saving as property
        for (let i = 0; i < dataset.length; i++) {
            const currentBox = document.querySelector(`#fieldList input[id="${dataset[i].name}"]`);
            if (!currentBox.checked) {
                dataset.splice(i, 1); // remove list from dataset
                i--;
            }
        }

        // remove the lists for this step
        parentDiv.removeChild(document.querySelector("#outerList"));

        // save dataset, move on to next step
        this.setState({dataset: dataset});
        this.ContinueProcess();
    }

    // allowing the user to choose categories for each step
    // saves edited dataset
    async ClassifySteps(dataset) {
        console.log("Classifying steps");
        console.log(dataset);
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
                steps: [this.SelectSteps, this.RemoveUnchecked, this.ClassifySteps, this.TerminateProcess], 
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
        this.state.steps[this.state.current](dataset);
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