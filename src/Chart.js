import Plot from 'react-plotly.js';

const Chart = (props) => {

    let data = [];
    let layout = {};

    // read in data from excel
    let processedData = JSON.parse(sessionStorage.getItem("dataset"));

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
        for(let wait of waitMeans) {
            // calculate percents
            let percent = (wait/waitMeanSum)*100;
            waitMeanPercents.push(Math.round(percent * 100)/100);
            // round means
            wait = Math.round(wait * 100)/100;
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
        }
        else if (props.fields === "action") {
            // should work too
            data.push({
                type: 'pie',
                labels: waitNames,
                values: waitMeans,
                text: waitNames,
                hovertemplate: "Room: %{label} <br>Mean Time (mins): %{value}"
            })
        }

        // customize layout for pie charts
        layout.height = 400;
        layout.width = 500;

    }
    else if (props.chartType === "pillar") {
        // -----------------------------------
        // Generate data needed for pillar charts

        let rooms = [];
        let means = [];
        let meanPercents = [];
        let stdvs = [];
        let ranges = [];
        let meanSum = 0;

        // run through all the rooms
        for(const dataColumn of processedData) {
            // add room name
            rooms.push(dataColumn.name);

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
        for(let mean of means) {
            // calculate percents
            let percent = (mean/meanSum)*100;
            meanPercents.push(Math.round(percent * 100)/100);
            // round means
            mean = Math.round(mean * 100)/100;
        }

        // -----------------------------------
        // Pick type of pillar chart
        if (props.fields === "stackedmeans") {
            data.push({
                type: 'bar',
                title: "Mean Times by Room (mins)",
                x: [],
                y: means,
                labels: rooms,
                hovertemplate: "Room: %{label} <br>Mean Time (mins): %{y}"
            })
        }
        else if (props.fields === "stackedmeanpercents") {

        }
        else if (props.fields === "rooms") {
            var meanTrace = {
                x: rooms,
                y: means,
                name: "Mean",
                type: "bar"
            };
            var stdvTrace = {
                x: rooms,
                y: stdvs,
                name: "Standard Dev.",
                type: "bar"
            };
            var rangeTrace = {
                x: rooms,
                y: ranges,
                name: "Range",
                type: "bar"
            };
            
            data.push(meanTrace);
            data.push(stdvTrace);
            data.push(rangeTrace);
            //data = [meanTrace, stdvTrace, rangeTrace];

            layout.barmode = "group";
        }

        // customize layout for pillar charts
        layout.height = 400;
        layout.width = 500;
    }

    
    // this is the proper return
    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <Plot data = {data}

            layout = {
                {
                    height: 400,
                    width: 500
                }
            }
            />
        </div>
    );

    // this is the debug return for wait+care pie
    /*
    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <Plot 
            data = {
                [{
                    type: 'pie',
                    labels: ['Wait Time', 'Care Time'],
                    values: [38.3*2, 61.7*2],
                    text: ['Mean Wait Time', 'Mean Care Time'],
                    hovertemplate: "%{label}: <br>Mean Total Time (mins): %{value}"
                }]
            }

            layout = {
                {
                    height: 400,
                    width: 500
                }
            }
            />
        </div>
    );
    */

    // this is the debug return for action pie
    /*
    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <Plot 
            data = {
                [{
                    type: 'pie',
                    labels: ["Wait 1", "Wait 2", "Wait 3"],
                    values: [40, 50, 60],
                    text: ["Wait 1", "Wait 2", "Wait 3"],
                    hovertemplate: "Room: %{label} <br>Mean Time (mins): %{value}"
                }]
            }

            layout = {
                {
                    height: 400,
                    width: 500
                }
            }
            />
        </div>
    );
    */

    // this is the debug return for stackedmeans
    // this does not work
    /*
    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <Plot 
            data = {
                [{
                    type: 'bar',
                    title: "Mean Times by Room (mins)",
                    x: [],
                    y: [10, 20, 30, 40, 50, 60],
                    labels: ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6"],
                    hovertemplate: "Room: %{label} <br>Mean Time (mins): %{y}"
                }]
            }

            layout = {
                {
                    height: 400,
                    width: 500
                }
            }
            />
        </div>
    );
    */

    // this is the debug return for rooms pillar
    /*
    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <Plot 
            data = {
                [
                    {
                        x: ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5"],
                        y: [20, 30, 15, 10, 25],
                        name: "Mean",
                        type: "bar"
                    },
                    {
                        x: ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5"],
                        y: [10, 15, 20, 25, 12],
                        name: "Standard Dev.",
                        type: "bar"
                    },
                    {
                        x: ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5"],
                        y: [50, 40, 30, 10, 25],
                        name: "Range",
                        type: "bar"
                    }
                ]
            }

            layout = {
                {
                    height: 400,
                    width: 500,
                    barmode: "group"
                }
            }
            />
        </div>
    );
    */
}

export default Chart;


