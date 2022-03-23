import ReactDOM from 'react-dom';
import Chart from "./Chart";

const DataInput = () => {
    let XLSX = require("xlsx");

    const LoadFile = async (e) => {
        console.log("Loading data");
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        return workbook;
    }

    const ExtractData = async (workbook) => {
        console.log("Extracting data");
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];    // first sheet in workbook
        var range = XLSX.utils.decode_range(worksheet['!ref']);     // range of sheet

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

    const ShowDataSettings = async (dataset) => {
        console.log("Showing import settings");
        // creating a promise to wait until we get div to make changes to it
        let dataImportDiv;
        const waitForDOM = new Promise((resolve, reject) => {
            dataImportDiv = document.getElementById("dataInSettings");
    
            resolve();
        });

        waitForDOM.then(() => {
            // making changes to the div once it is loaded
            dataImportDiv.style.display = "block";

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
            dataImportDiv.appendChild(fieldList);

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

            // creating a visualize button that will remove unchecked fields from dataset
            const continueBtn = document.createElement("button");
            continueBtn.onclick = () => {
                // reading checkmarks and saving as property
                for (let i = 0; i < dataset.length; i++) {
                    const currentBox = document.querySelector(`#fieldList input[id="${dataset[i].name}"]`);
                    if (!currentBox.checked) {
                        dataset.splice(i, 1); // remove list from dataset
                        i--;
                    }
                }

                // remove the lists for this step and transition to step 2
                dataImportDiv.removeChild(document.querySelector("#outerList"));
                dataImportDiv.removeChild(continueBtn);

                // step 2
                waitSelection();
            };
            continueBtn.innerHTML = "Continue";

            dataImportDiv.appendChild(continueBtn);

            // step 2: classify fields as wait or care
            const waitSelection = () => {
                // change instructions
                const instructions = document.getElementById("inputInstructions");
                instructions.innerHTML = "Dataset trimmed! Check all steps that should be classified as care time, and leave all steps that are wait time unchecked."

                // list of checkboxes to indicate which steps are wait vs care time
                const buttonList = document.createElement("ul");
                buttonList.id = "typeList";
                buttonList.style = "list-style: none";

                for (let list of dataset) {
                    // building out the checkboxes
                    const item = document.createElement("li");

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = list.name;

                    const label = document.createElement("label");
                    label.for = list.name;
                    label.innerHTML = list.name;

                    // putting the components into a list item and adding that item to the list
                    item.appendChild(checkbox);
                    item.appendChild(label);
                    buttonList.appendChild(item);
                }
                // putting the list into the div
                dataImportDiv.appendChild(buttonList);

                // creating a visualize button that will create the graphs
                const visualizeBtn = document.createElement("button");
                visualizeBtn.onclick = () => {
                    // reading checkmarks and saving as property
                    for (let list of dataset) {
                        const currentBox = document.querySelector(`#typeList input[id="${list.name}"]`);
                        list.type = currentBox.checked ? "care" : "wait";
                    }

                    // saving the dataset to storage
                    sessionStorage.setItem("dataset", JSON.stringify(dataset));

                    // can access the dataset like this:
                    console.log(JSON.parse(sessionStorage.getItem("dataset")));

                    // code to create the graphs would go here
                    // also add code to hide this div
                    CreateVisualizations();

                    // removing the data input elements
                    const appDiv = document.getElementsByClassName("App")[0];
                    const dataIn = document.getElementsByClassName("dataIn")[0];
                    appDiv.removeChild(dataIn);
                };
                visualizeBtn.innerHTML = "Create Visualizations";

                dataImportDiv.appendChild(visualizeBtn);
            };
        });
    }

    const CreateVisualizations = async () => {
        console.log("Creating graphs");

        const charts = [
            <Chart chartType="pie" fields="wait+care" rec="Recommendation from chart 1." id="pie1"/>,
            <Chart chartType="pie" fields="action" rec="Recommendation from chart 2." id="pie2"/>,
            <Chart chartType="pillar" fields="rooms" rec="Recommendation from chart 3." id="pillar1"/>,
            <Chart chartType="pillar" fields="stackedmeans" rec="Recommendation from chart 4." id="pillar2"/>,
            <Chart chartType="pillar" fields="stackedmeanpercents" rec="Recommendation from chart 5." id="pillar3"/>,
        ];

        let parentChartDiv;
        const getParentChartDiv = new Promise((resolve, reject) => {
            parentChartDiv = document.getElementById("chartsDiv");

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

    const ProcessDataset = async (e) => {
        console.log("Processing");
        const load = new Promise((resolve, reject) => {
            let workbook = LoadFile(e);

            resolve(workbook);
        });

        const extract = new Promise((resolve, reject) => {
            let dataset = load.then((workbook) => ExtractData(workbook));

            resolve(dataset);
        });
        
        extract.then((dataset) => ShowDataSettings(dataset)); 
    }

    return (
        <div className="dataIn">
            <input type="file" id="dataInForm" onChange={ProcessDataset}></input>
            <div className="dataInSettings" id="dataInSettings" style={{display: "none"}}>
                <p id="inputInstructions">
                    Data was successfully loaded! Check all steps that should be processed as steps of the process.
                </p>
            </div>
        </div>
    )
}

export default DataInput;