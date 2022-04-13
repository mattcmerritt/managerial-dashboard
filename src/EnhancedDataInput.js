import React, { Component } from 'react';
import Chart from './Chart';
import GraphvizChart from './GraphvizChart';
import ReactDOM from 'react-dom';

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
        this.AddCategories = this.AddCategories.bind(this);
        this.OrderSteps = this.OrderSteps.bind(this);
        this.SaveOrder = this.SaveOrder.bind(this);
        this.PerformStep = this.PerformStep.bind(this);
        this.ContinueProcess = this.ContinueProcess.bind(this);
        this.TerminateProcess = this.TerminateProcess.bind(this);
        this.GenerateRecommendations = this.GenerateRecommendations.bind(this);
        this.GenerateCharts = this.GenerateCharts.bind(this);
        this.CreateProcessFlow = this.CreateProcessFlow.bind(this);
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
                if(dataValue != null) {
                    dataArray.push(dataValue);
                }
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
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");
        const instructions = document.getElementById(this.props.group + "InputInstructions");
        instructions.innerHTML = "Data was successfully loaded! Check all steps that should be processed as steps of the process.";

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
            const checkbox = parentDiv.querySelector(`#fieldList input[id="${list.name}"]`);

            checkbox.addEventListener("click", () => {
                const newState = checkbox.checked;

                const parentBox = parentDiv.querySelector(`#outerList input[id="allFields"]`);
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
            const currentBox = parentDiv.querySelector(`#fieldList input[id="${dataset[i].name}"]`);
            if (!currentBox.checked) {
                dataset.splice(i, 1); // remove list from dataset
                i--;
            }
        }

        // remove the lists for this step
        parentDiv.removeChild(parentDiv.querySelector("#outerList"));

        // save dataset, move on to next step
        this.setState({dataset: dataset});
        this.ContinueProcess();
    }

    // allowing the user to choose categories for each step
    // saves edited dataset
    async ClassifySteps(dataset) {
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");
        const instructions = document.getElementById(this.props.group + "InputInstructions");
        instructions.innerHTML = "Please classify each step of the process based on what is taking place.";
        
        const categories = ["care", "wait", "travel", "other"];

        // creating the list of dropdowns
        const stepList = document.createElement("ul");
        stepList.id = "stepList";
        stepList.style = "list-style: none";

        for (let list of dataset) {
            // building out the selection dropdowns
            const item = document.createElement("li");

            const dropdown = document.createElement("select");
            dropdown.name = list.name;
            dropdown.id = list.name + "-select";

            // creating the options in the dropdown menus
            for (const category of categories) {
                const option = document.createElement("option");
                option.value = category;
                option.innerHTML = category.charAt(0).toUpperCase() + category.slice(1, category.length);

                dropdown.appendChild(option);
            }

            const label = document.createElement("label");
            label.for = list.name;
            label.innerHTML = `${list.name}: `;

            // putting the elements into the item, putting item into list
            item.appendChild(label);
            item.appendChild(dropdown);
            stepList.appendChild(item);
        }

        parentDiv.appendChild(stepList);

        // saving dataset for next step in the process
        this.setState({dataset: dataset});
    }

    // based on the dropdown options, save the categories to the dataset
    // saves edited dataset
    // should start next step without button
    async AddCategories(dataset) {
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");

        // reading checkmarks and saving as property
        for (let i = 0; i < dataset.length; i++) {
            const currentDropdown = parentDiv.querySelector(`#stepList select[id="${dataset[i].name}-select"]`);
            dataset[i].type = currentDropdown.options[currentDropdown.selectedIndex].value;
        }

        // remove the lists for this step
        parentDiv.removeChild(parentDiv.querySelector("#stepList"));

        // save dataset, move on to next step
        this.setState({dataset: dataset});
        this.ContinueProcess();
    }

    // allowing the user to choose which step leads to where for process flow
    // saves edited dataset
    async OrderSteps(dataset) {
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");
        const instructions = document.getElementById(this.props.group + "InputInstructions");
        instructions.innerHTML = "For each step in the process, please indicate how many and which step(s) it leads to.";
        
        // getting a list of all steps
        const steps = ["Start"];
        console.log(dataset);
        for (const step of dataset) {
            steps.push(step.name);
        }
        steps.push("End");

        // creating the list of dropdowns
        const stepList = document.createElement("ul");
        stepList.id = "stepList";
        stepList.style = "list-style: none";

        let stepCount = 1;
        for (let list of dataset) {
            // building out the selection dropdowns
            const item = document.createElement("li");
            item.id = list.name + "-steps";

            const label = document.createElement("label");
            label.for = list.name;
            label.innerHTML = `Step ${stepCount}, ${list.name}: `;

            const nextInput = document.createElement("input");
            nextInput.id = list.name + "-nextInput";
            nextInput.type = "number";
            nextInput.min = 1;
            nextInput.max = steps.length - 1;
            nextInput.value = 1;    // setting default value

            const nextStepList = document.createElement("ul");
            nextStepList.id = list.name + "-nextList";
            nextStepList.style = "list-style: none";

            // adding the first child box
            const subitem = document.createElement("li");
            const newSelect = document.createElement("select");
            const selectLabel = document.createElement("label");
            selectLabel.innerHTML = "Next Step: ";
            
            for (const step of steps) {
                const option = document.createElement("option");
                option.value = step;
                option.innerHTML = step;

                newSelect.appendChild(option);
            }

            // setting default selection to the one below it
            newSelect.selectedIndex = stepCount + 1;
            
            // put in selection array
            subitem.append(selectLabel);
            subitem.appendChild(newSelect);
            nextStepList.appendChild(subitem);

            nextInput.addEventListener("change", () => {
                const selections = Array.from(item.querySelectorAll("li"));

                while (selections.length < nextInput.value) {
                    // add new select
                    const subitem = document.createElement("li");
                    const newSelect = document.createElement("select");
                    const selectLabel = document.createElement("label");
                    selectLabel.innerHTML = "Next Step: ";
                    
                    for (const step of steps) {
                        const option = document.createElement("option");
                        option.value = step;
                        option.innerHTML = step;

                        newSelect.appendChild(option);
                    }
                    
                    // put in selection array
                    subitem.append(selectLabel);
                    subitem.appendChild(newSelect);
                    nextStepList.appendChild(subitem);
                    selections.push(newSelect);
                }

                while (selections.length > nextInput.value) {
                    // remove last select
                    const removed = selections.pop();
                    removed.remove();
                }
            });

            // putting the elements into the item, putting item into list
            item.appendChild(label);
            item.appendChild(nextInput);
            item.appendChild(nextStepList);
            stepList.appendChild(item);

            stepCount++;
        }

        parentDiv.appendChild(stepList);

        // saving dataset for next step in the process
        this.setState({dataset: dataset});
    }

    // based on the dropdown options, save the next steps to the dataset
    // saves edited dataset
    // should start next step without button
    async SaveOrder(dataset) {
        const parentDiv = document.getElementById(this.props.group + "DataInSettings");

        // reading in the list of next steps, saving to property
        for (let i = 0; i < dataset.length; i++) {
            const listItem = parentDiv.querySelector(`#stepList li[id="${dataset[i].name + "-steps"}"]`);

            const childNodeSelects = Array.from(listItem.querySelectorAll("select"));

            const childNames = [];
            for (const select of childNodeSelects) {
                childNames.push(select.options[select.selectedIndex].value);
            }
            dataset[i].nextSteps = childNames;
        }

        // remove the lists for this step
        parentDiv.removeChild(parentDiv.querySelector("#stepList"));

        // save dataset, move on to next step
        this.setState({dataset: dataset});
        this.ContinueProcess();
    }

    // method that ends the chain of method calls in the process
    async TerminateProcess(dataset) {
        // remove the button and settings div
        const button = document.querySelector(`.${this.props.group}DataIn button`);
        button.remove();

        const settings = document.getElementById(this.props.group + "DataInSettings");
        settings.remove();

        // write dataset to session storage
        sessionStorage.setItem(this.props.group + "Dataset", JSON.stringify(dataset));

        // creating recommendations and generating the charts
        this.GenerateRecommendations();
        this.GenerateCharts();

        // debug
        console.log(await this.CreateProcessFlow());
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
                steps: [this.SelectSteps, this.RemoveUnchecked, this.ClassifySteps, this.AddCategories, this.OrderSteps, this.SaveOrder, this.TerminateProcess], 
                dataset: initialDataset
            }
        );

        this.PerformStep(initialDataset);

        const nextButton = document.createElement("button");
        nextButton.onclick = this.ContinueProcess;
        nextButton.innerHTML = "Continue";
        
        const parentDiv = document.getElementsByClassName(this.props.group + "DataIn")[0];
        parentDiv.appendChild(nextButton);
        
        const settings = document.getElementById(this.props.group + "DataInSettings");
        settings.style.display = "block";
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

    // ---------- The code below is the generation of the charts and ----------
    // ---------- writing the recommendations to show in the windows ----------
    
    // builds out the specific charts for the given dataset using the
    // Chart and GraphvizChart components
    async GenerateCharts() {
        if (this.props.group === "patient") {
            const dot = await this.CreateProcessFlow();

            const charts = [
                <GraphvizChart src={dot} engine={"dot"} viz={this.props.viz} data={this.props.group} title="Patient Process Flow Diagram" />,
                <Chart chartType="pie" fields="categories" id="pie1" source={this.props.group}/>,
                <Chart chartType="pie" fields="care" id="pie2" source={this.props.group}/>,
                <Chart chartType="pie" fields="wait" id="pie3" source={this.props.group}/>,
                <Chart chartType="pillar" fields="steps" id="pillar1" source={this.props.group}/>,
                <Chart chartType="pillar" fields="stackedmeans" id="pillar2" source={this.props.group}/>,
                <Chart chartType="pillar" fields="stackedmeanpercents" id="pillar3" source={this.props.group}/>,
                <Chart chartType="pillar" fields="focusPillar" id="focuspillar" source={this.props.group}/>,
                <Chart chartType="pillar" fields="focusStack" id="focusstack" source={this.props.group}/>,
            ];
    
            let parentChartDiv;
            const getParentChartDiv = new Promise((resolve, reject) => {
                parentChartDiv = document.getElementById(this.props.group + "ChartsDiv");
    
                resolve();
            });
    
            getParentChartDiv.then(() => {
                for (let chart of charts) {
                    let chartDiv = document.createElement("div");
                    parentChartDiv.appendChild(chartDiv);
        
                    ReactDOM.render(chart, chartDiv);
                }
            });   
        }
        else if (this.props.group === "staff") {
            const dot = await this.CreateProcessFlow();

            const charts = [
                <GraphvizChart src={dot} engine={"dot"} viz={this.props.viz} data={this.props.group} title="Staff Process Flow Diagram" />,
                <Chart chartType="pie" fields="categories" id="pie1" source={this.props.group}/>,
                <Chart chartType="pie" fields="care" id="pie2" source={this.props.group}/>,
                <Chart chartType="pie" fields="travel" id="pie3" source={this.props.group}/>,
                <Chart chartType="pillar" fields="steps" id="pillar1" source={this.props.group}/>,
                <Chart chartType="pillar" fields="stackedmeans" id="pillar2" source={this.props.group}/>,
                <Chart chartType="pillar" fields="stackedmeanpercents" id="pillar3" source={this.props.group}/>,
                <Chart chartType="pillar" fields="focusPillar" id="focuspillar" source={this.props.group}/>,
                <Chart chartType="pillar" fields="focusStack" id="focusstack" source={this.props.group}/>,
            ];
    
            let parentChartDiv;
            const getParentChartDiv = new Promise((resolve, reject) => {
                parentChartDiv = document.getElementById(this.props.group + "ChartsDiv");
    
                resolve();
            });
    
            getParentChartDiv.then(() => {
                for (let chart of charts) {
                    let chartDiv = document.createElement("div");
                    parentChartDiv.appendChild(chartDiv);
        
                    ReactDOM.render(chart, chartDiv);
                }
            });
        }
    }

    // adds the specific recommendations for the each chart in the dataset
    async GenerateRecommendations() {
        // create the recommendations
        let recommendations = [];
        if(this.props.group === "patient") {
            recommendations.push({
                id: "pie1",
                genericRecommendation: "The patient is spending a considerable percent of their time waiting. See the other visualizations to find the steps responsible for the large wait.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pie2",
                genericRecommendation: "This chart shows the percent of the total wait experienced by a patient each wait step is.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pillar1",
                genericRecommendation: "There is a large range for the Provider step. It may be worth looking into what could be causing this range.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pillar2",
                genericRecommendation: "Below you see a pillar chart. This first pillar chart will show the average overall time. \nThe bar will be broken to show how much time is spend in each location within the entire average time.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pillar3",
                genericRecommendation: "Now after seeing that, we will look at the average total time as a percent. \nThe location with the largest percentage will be our first focus point.",
                expertRecommendation: undefined
            });
        }
        else if (this.props.group === "staff") {
            recommendations.push({
                id: "pie1",
                genericRecommendation: "The staff is spending most of their time caring for patients.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pie2",
                genericRecommendation: "Since there is only one wait step, there is not much to conclude here.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pillar1",
                genericRecommendation: "Consider minimizing the range for the Walk Back step.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pillar2",
                genericRecommendation: "Below you see a pillar chart. This first pillar chart will show the average overall time. \nThe bar will be broken to show how much time is spend in each location within the entire average time.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pillar3",
                genericRecommendation: "This chart shows the average overall time of each step as a percent of the total time.",
                expertRecommendation: undefined
            });
        }

        if (sessionStorage.getItem("expertRecommendations") !== null) {
            // check for expert recommendations
            const expertRecs = JSON.parse(sessionStorage.getItem("expertRecommendations"));
            
            // getting the right set of recs (patient/staff)
            let recSet;
            for (let set of expertRecs) {
                if (this.props.group === set.id) {
                    recSet = set;
                }
            }

            // overwriting undefined recommendations
            for (let rec of recSet.recs) {
                // find corresponding chart in recommendations array
                for (let chart of recommendations) {
                    if (chart.id === rec.chartId) {
                        chart.expertRecommendation = rec.rec;
                    }
                }
            }
        }

        // saving recommendations to session storage to access at chart generation
        sessionStorage.setItem(this.props.group + "Recommendations", JSON.stringify(recommendations));
    }

    // builds a linear process flow diagram
    async CreateProcessFlow() {
        // load data from storage
        const dataset = JSON.parse(sessionStorage.getItem(this.props.group + "Dataset"));
        
        // list of strings to use in the flowchart
        let nodeMessages = [];

        for(const column of dataset) {
            // find mean (sum of all divided by number of elements)
            let mean = 0;
            for(const value of column.data) {
                mean += value;
            }
            mean /= column.data.length;

            // find standard deviation (s = sqrt(sum((actual - mean)^2)/(n-1)))
            let numerator = 0;
            for(let i = 0; i < column.data.length; i++) {
                numerator += (column.data[i] - mean) ** 2;
            }
            let stdv = Math.sqrt(numerator/(column.data.length - 1));

            nodeMessages.push(`${column.name}: \\n Mean Time: ${Math.round(mean * 100)/100} mins \\n Standard Deviation: ${Math.round(stdv * 100)/100} mins`);
        }

        let nodes = `start [shape="ellipse" label="Start"]`;
        for(let i = 0; i < nodeMessages.length; i++) {
            nodes += `node${i} [shape="rect" label="${nodeMessages[i]}"]\n\t`;
        }
        nodes += `end [shape="ellipse" label="End"]`;

        let connections = `start -> `;
        for(let i = 0; i < nodeMessages.length; i++) {
            connections += `node${i}\n\tnode${i} -> `;
        }
        connections += `end`;

        const dot = `digraph processFlow {\n\trankdir="LR"\n\tsize=17.5\n\tratio="compress"\n\t` + nodes + "\n\t" + connections + `\n}`;

        return dot;
    }

    render() {
        return (
            <div className={this.props.group + "DataIn"} style={this.props.enabled ? {display : "block"} : {display: "none"}}>
                <input type="file" id={this.props.group + "DataInForm"} onChange={this.ProcessDataset}></input>
                <div className={this.props.group + "DataInSettings"} id={this.props.group + "DataInSettings"} style={{display: "none"}}>
                    <p id={this.props.group + "InputInstructions"}></p>
                </div>
            </div>
        );
    }
}

export default EnhancedDataInput;