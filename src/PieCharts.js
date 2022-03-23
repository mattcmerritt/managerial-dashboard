import React from 'react';
import Plot from 'react-plotly.js';

const PieCharts = (props) => {
    var XLSX = require("xlsx");

    // bad but temp
    let waitMeans = [];
    let waitPercents = [];

    let waitSum = 0;
    let careSum = 0;

    const ExtractData = (workbook) => {
        
        //let workbook = XLSX.readFile(filepath);
        //let table = XLSX.utils.sheet_to_json(workbook)
        let worksheet = workbook.Sheets[workbook.SheetNames[0]]; // first sheet in workbook
        var range = XLSX.utils.decode_range(worksheet['!ref']); // range of sheet

        let colLetter = 'A';
        const starterLetterValue = colLetter.charCodeAt(0);
        let colLetterValue = starterLetterValue;
        
        let dataset = [];

        // https://www.npmjs.com/package/xlsx#working-with-the-workbook
        // ignore column 1 (Patient ID) for now
        for(let currCol = 0; currCol <= range.e.c; currCol++) {
            // first cell in a column is the name, so fetch that separately
            let nameCell = worksheet[colLetter + 1];
            let name = (nameCell ? nameCell.v : undefined);
            //console.log(name);

            // rest of the cells are values, so fetch and add to an array
            const dataArray = [];
            for(let currRow = 1; currRow < range.e.r; currRow++) {
                let dataCellAddress = colLetter + (currRow + 1);
                let dataCell = worksheet[dataCellAddress];
                let dataValue = (dataCell ? dataCell.v : undefined);
                dataArray.push(dataValue);
            }
            //console.log(dataArray);

            dataset.push(
                {
                    name: name,
                    data: dataArray,
                }
            );

            colLetterValue++;
            colLetter = String.fromCharCode(colLetterValue);
        }

        //console.log(dataset);
        return dataset;

    }

    const CreatePieCharts = (processedData) => {

        processedData.shift(); // remove the first element - the Patient ID field

        // let waitMeans = [];
        // let waitPercents = [];

        // let waitSum = 0;
        // let careSum = 0;

        // run through all of the data columns in the excel file
        for(const dataColumn of processedData) {
            // find mean (sum of all divided by number of elements)
            let mean = 0;
            for(const value of dataColumn.data) {
                mean += value;
            }
            mean /= dataColumn.data.length;

            if(dataColumn.name.contains("Wait")) {
                waitSum += mean
                waitMeans.push(mean);
            }
            else {
                careSum += mean;
            }
        }

        // calculate percent each wait makes of all waiting
        for(const wait in waitMeans) {
            let percent = (wait/waitSum)*100;
            waitPercents.push(Math.round(percent * 100)/100) ;
        }

        // return (
        // {
        //     waitSum: waitSum,
        //     careSum: careSum
        // }
        // );
    }

    // reading file from the pages input form
    async function handleFileAsync(e) {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        CreatePieCharts(ExtractData(workbook));
    }

    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <Plot data = {[
                {
                    type: 'pie',
                    labels: ['Wait Time', 'Care Time'],
                    values: [waitSum, careSum],
                    text: ['Mean Wait Time', 'Mean Care Time'],
                    hovertemplate: "%{label}: <br>Mean Total Time (mins): %{value}"
                }
            ]}

            layout = {
                {
                    height: 400,
                    width: 500
                }
            }
            />
            <input type="file" id="pfInput" onChange={handleFileAsync}></input>
        </div>
    );
}

export default PieCharts;


