import Plot from 'react-plotly.js';

const Chart = (props) => {

    const data = {};

    if (props.chartType == "pie") {
        
        // -----------------------------------
        // Generate data needed for pie charts

        let waitMeans = [];
        let waitPercents = [];
        let waitNames = [];
        let waitSum = 0;
        let careSum = 0;
        let processedData = JSON.parse(sessionStorage.getItem("dataset"));

        // run through all of the data columns in the excel file
        for(const dataColumn of processedData) {
            // find mean (sum of all divided by number of elements)
            let mean = 0;
            for(const value of dataColumn.data) {
                mean += value;
            }
            mean /= dataColumn.data.length;

            if(dataColumn.type == "wait") {
                waitNames.push(dataColumn.name);
                waitSum += mean;
                waitMeans.push(mean);
            }
            else {
                careSum += mean;
            }
        }

        // calculate percent each wait makes of all waiting
        for(const wait in waitMeans) {
            let percent = (wait/waitSum)*100;
            waitPercents.push(Math.round(percent * 100)/100);
        }

        // -----------------------------------
        // Pick type of pie chart

        if (props.fields == "wait+care") {
            // to my knowledge, this one works
            data.type = 'pie';
            data.labels = ['Wait Time', 'Care Time'];
            data.values = [waitSum, careSum];
            data.text = ['Mean Wait Time', 'Mean Care Time'];
            data.hovertemplate = "%{label}: <br>Mean Total Time (mins): %{value}";
        }
        else if (props.fields == "action") {
            // should work too
            data.type = 'pie';
            data.labels = waitNames;
            data.values = waitMeans;
            data.text = waitNames;
            data.hovertemplate = "Room: %{label} <br>Mean Time (mins): %{value}";
        }

    }

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
}

export default Chart;


