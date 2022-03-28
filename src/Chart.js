import Plot from 'react-plotly.js';

const Chart = (props) => {

    let data = [];
    let layout = {};

    // read in data from excel
    let processedData = JSON.parse(sessionStorage.getItem(props.source + "Dataset"));

    if (props.chartType === "pie") {
        
        // -----------------------------------
        // Generate data needed for pie charts

        let waitMeans = [];
        let waitMeanPercents = [];
        let waitNames = [];
        let waitMeanSum = 0;
        let careMeanSum = 0;

        // run through all of the data columns in the excel file
        for(const dataColumn of processedData) {
            // find mean (sum of all divided by number of elements)
            let mean = 0;
            for(const value of dataColumn.data) {
                mean += value;
            }
            mean /= dataColumn.data.length;

            if(dataColumn.type === "wait") {
                waitNames.push(dataColumn.name);
                waitMeanSum += mean;
                waitMeans.push(mean);
            }
            else {
                careMeanSum += mean;
            }
        }
        // round sums to 2 decimal places
        waitMeanSum = Math.round(waitMeanSum * 100)/100;
        careMeanSum = Math.round(careMeanSum * 100)/100;

        // calculate percent each wait makes of all waiting, also round means now that we're done working with them
        for(let i = 0; i < waitMeans.length; i++) {
            // calculate percents
            let percent = (waitMeans[i]/waitMeanSum)*100;
            waitMeanPercents.push(Math.round(percent * 100)/100);
            // round means
            waitMeans[i] = Math.round(waitMeans[i] * 100)/100;
        }

        // -----------------------------------
        // Pick type of pie chart

        if (props.fields === "wait+care") {
            // to my knowledge, this one works
            data.push({
                type: 'pie',
                labels: ['Wait Time', 'Care Time'],
                values: [waitMeanSum, careMeanSum],
                text: ['Mean Wait Time', 'Mean Care Time'],
                hovertemplate: "%{label}: <br>Mean Total Time (mins): %{value}"
            });  
            layout.title = "Time by Step Category";
        }
        else if (props.fields === "action") {
            // should work too
            data.push({
                type: 'pie',
                labels: waitNames,
                values: waitMeans,
                text: waitNames,
                hovertemplate: "Step: %{label} <br>Mean Time (mins): %{value}"
            });
            layout.title = "Total Wait Time by Step";
        }

        // customize layout for pie charts
        layout.height = 400;
        layout.width = 500;

    }
    else if (props.chartType === "pillar") {
        // -----------------------------------
        // Generate data needed for pillar charts

        let steps = [];
        let means = [];
        let meanPercents = [];
        let stdvs = [];
        let ranges = [];
        let meanSum = 0;

        // run through all the steps
        for(const dataColumn of processedData) {
            // add step name
            steps.push(dataColumn.name);

            // find mean (sum of all divided by number of elements)
            let mean = 0;
            for(const value of dataColumn.data) {
                mean += value;
            }
            mean /= dataColumn.data.length;
            meanSum += mean;
            means.push(mean);

            // find standard deviation
            let summation = 0;
            for(const value of dataColumn.data) {
                summation += Math.pow(value - mean, 2);
            }
            let stdv = Math.sqrt(summation/(dataColumn.data.length - 1));
            stdvs.push(Math.round(stdv * 100)/100);

            // find range
            let min = Number.MAX_SAFE_INTEGER;
            let max = Number.MIN_SAFE_INTEGER;
            for(const value of dataColumn.data) {
                min = Math.min(value, min);
                max = Math.max(value, max);
            }
            let range = max - min;
            ranges.push(Math.round(range * 100)/100);
        }

        // calculate mean percents, also round means now that we're done working with them
        for(let i = 0; i < means.length; i++) {
            // calculate percents
            let percent = (means[i]/meanSum)*100;
            meanPercents.push(Math.round(percent * 100)/100);
            // round means
            means[i] = Math.round(means[i] * 100)/100;
        }

        // -----------------------------------
        // Pick type of pillar chart
        if (props.fields === "stackedmeans") {
            for(let i = 0; i < steps.length; i++) {
                data.push({
                    type: 'bar',
                    x: [""],
                    y: [means[i]],
                    name: steps[i],
                    hovertemplate: "Step: " + steps[i] + "<br>Mean Time (mins): %{y}",
                    width: 0.1
                });
            }

            layout.barmode = "stack";
            layout.title = "Mean Times by Step (mins)";
            layout.yaxis = {title: "Mean (mins)"};
        }
        else if (props.fields === "stackedmeanpercents") {
            for(let i = 0; i < steps.length; i++) {
                data.push({
                    type: 'bar',
                    x: [""],
                    y: [meanPercents[i]],
                    name: steps[i],
                    hovertemplate: "Step: " + steps[i] + "<br>Mean Time (%): %{y}%",
                    width: 0.1
                });
            }

            layout.barmode = "stack";
            layout.title = "Mean Times by Step (%)";
            layout.yaxis = {title: "Mean (mins)"};
        }
        else if (props.fields === "steps") {
            var meanTrace = {
                x: steps,
                y: means,
                name: "Mean",
                type: "bar"
            };
            var stdvTrace = {
                x: steps,
                y: stdvs,
                name: "Standard Dev.",
                type: "bar"
            };
            var rangeTrace = {
                x: steps,
                y: ranges,
                name: "Range",
                type: "bar"
            };
            
            data.push(meanTrace);
            data.push(stdvTrace);
            data.push(rangeTrace);
            //data = [meanTrace, stdvTrace, rangeTrace];

            layout.barmode = "group";
            layout.title = "Times by Step";
            layout.xaxis = {title: "Step"};
            layout.yaxis = {title: "Time (mins)"};
        }

        // customize layout for pillar charts
        layout.height = 400;
        layout.width = 500;
    }
    
    // this is the proper return
    return (
        <div className="graphWindow" id={props.id}>
            <Plot data = {data}

            layout = {layout}
            />
            <button 
            onClick={() => {
                let chartDiv = document.getElementById(props.source + "ChartsDiv");
                let text = chartDiv.querySelector(`#${props.id} p`);
                text.style.display = "inline-block";

                // recommendations
                let recText = "Recommendations could not be loaded.";
                let recArray = JSON.parse(sessionStorage.getItem(props.source + "Recommendations"));
                let recObj;

                // finding recommendations object in array
                for (let rec of recArray) {
                    if (rec.id === props.id) {
                        recObj = rec;
                    }
                }

                // loading recommendations from object
                if (recObj.genericRecommendation !== undefined && recObj.expertRecommendation !== undefined) {
                    recText = recObj.genericRecommendation + "<br><br>" + "Expert Recommendation: " + recObj.expertRecommendation;
                } else if (recObj.genericRecommendation !== undefined) {
                    recText = recObj.genericRecommendation;
                } else if (recObj.expertRecommendation !== undefined) {
                    recText = "Expert Recommendation: " + recObj.expertRecommendation;
                } else {
                    recText = "No recommendations were found.";
                }

                text.innerHTML = recText;
            }} style={{display : "inline-block"}}>
                Show Recommendation
            </button>
            <p id="recText" style={{display: "none"}}></p>
        </div>
    );
}

export default Chart;


