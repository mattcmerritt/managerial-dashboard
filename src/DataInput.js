import React, { Component } from "react";
import PieCharts from "./PieCharts";

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
                label.innerHTML = `${list.name} (${list.data.length} items)`;

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
                console.log("Creating graphs!");
                const pie = React.createElement(PieCharts);
                const chart = document.createElement("div");
                chart.innerHTML = pie;
                
                const appDiv = document.querySelector("div.App");
                appDiv.appendChild(chart);
                
            };
            visualizeBtn.innerHTML = "Create Visualizations";

            dataImportDiv.appendChild(visualizeBtn);
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
                <p>
                    Data was successfully loaded! Check which steps involve waiting, and leave all care steps unchecked.
                </p>
            </div>
        </div>
    )
}

export default DataInput;