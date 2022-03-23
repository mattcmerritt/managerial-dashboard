import React from 'react';
import Plot from 'react-plotly.js';

const PieCharts = (props) => {
    var XLSX = require("xlsx");

    // bad but temp
    let waitMeans = [];
    let waitPercents = [];

    let waitSum = 0;
    let careSum = 0;

    const CreatePieCharts = () => {

        let processedData = JSON.parse(sessionStorage.getItem("dataset"));

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

    CreatePieCharts();

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
        </div>
    );
}

export default PieCharts;


