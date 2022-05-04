import Plot from 'react-plotly.js';
import ReactDOM from 'react-dom';

const Chart = (props) => {

    let data = [];
    let layout = {};

    let dataBefore = [];
    let layoutBefore = {};

    let dataAfter = [];
    let layoutAfter = {};

    // read in data from excel
    let processedData;
    if (props.datasetIndex === -3) { // cumulative of all weeks
        const datasets = JSON.parse(sessionStorage.getItem(props.source + "Datasets"));
        processedData = datasets[0];

        for(let i = 1; i < datasets.length; i++) {
            const additionalData = datasets[i];
            for(let j = 0; j < additionalData.length; j++) {
                for(const point of additionalData[j].data) {
                    processedData[j].data.push(point);
                }
            }
        }
        console.log(processedData);
    }
    else if (props.datasetIndex === -2) { // cumulative of all weeks less current
        const datasets = JSON.parse(sessionStorage.getItem(props.source + "Datasets"));
        processedData = datasets[0];

        for(let i = 1; i < datasets.length - 1; i++) {
            const additionalData = datasets[i];
            for(let j = 0; j < additionalData.length; j++) {
                for(const point of additionalData[j].data) {
                    processedData[j].data.push(point);
                }
            }
        }
        console.log(processedData);
    }
    else if (props.datasetIndex === undefined || props.datasetIndex === -1) {
        processedData = JSON.parse(sessionStorage.getItem(props.source + "Dataset")); // use the current dataset
    }
    else {
        const ds = JSON.parse(sessionStorage.getItem(props.source + "Datasets"));
        processedData = ds[props.datasetIndex]; // use the specified dataset index
    }

    if (props.chartType === "pie") {
        
        // -----------------------------------
        // Generate data needed for pie charts

        let waitMeans = [];
        let careMeans = [];
        let travelMeans = [];
        let otherMeans = [];
        let waitMeanPercents = [];
        let waitNames = [];
        let careNames = [];
        let travelNames = [];
        let otherNames = [];
        let waitMeanSum = 0;
        let careMeanSum = 0;
        let travelMeanSum = 0;
        let otherMeanSum = 0;

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
            else if (dataColumn.type === "care") {
                careNames.push(dataColumn.name);
                careMeanSum += mean;
                careMeans.push(mean);
            }
            else if (dataColumn.type === "travel") {
                travelNames.push(dataColumn.name);
                travelMeanSum += mean;
                travelMeans.push(mean);
            }
            else {
                otherNames.push(dataColumn.name);
                otherMeanSum += mean;
                otherMeans.push(mean);
            }
        }
        // round sums to 2 decimal places
        waitMeanSum = Math.round(waitMeanSum * 100)/100;
        careMeanSum = Math.round(careMeanSum * 100)/100;
        travelMeanSum = Math.round(travelMeanSum * 100)/100;
        otherMeanSum = Math.round(otherMeanSum * 100)/100;

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

        if (props.fields === "categories") {
            // figure out which categories actually have entries
            let names = [];
            let meanSums = [];
            let hoverText = [];
            if(waitMeanSum !== 0) {
                names.push('Wait Time');
                meanSums.push(waitMeanSum);
                hoverText.push('Mean Wait Time');
            }
            if(careMeanSum !== 0) {
                names.push('Care Time');
                meanSums.push(careMeanSum);
                hoverText.push('Mean Care Time');
            }
            if(travelMeanSum !== 0) {
                names.push('Travel Time');
                meanSums.push(travelMeanSum);
                hoverText.push('Mean Travel Time');
            }
            if(otherMeanSum !== 0) {
                names.push('Other Time');
                meanSums.push(otherMeanSum);
                hoverText.push('Mean Other Time');
            }
            // create visualization with nonempty entries
            data.push({
                type: 'pie',
                labels: names,
                values: meanSums,
                text: hoverText,
                hovertemplate: "%{label}: <br>Mean Total Time (mins): %{value}"
            });  
            layout.title = "Time by Step Category";
        }
        else if (props.fields === "wait") {
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
        else if (props.fields === "care") {
            // should work too
            data.push({
                type: 'pie',
                labels: careNames,
                values: careMeans,
                text: careNames,
                hovertemplate: "Step: %{label} <br>Mean Time (mins): %{value}"
            });
            layout.title = "Total Care Time by Step";
        }
        else if (props.fields === "travel") {
            // should work too
            data.push({
                type: 'pie',
                labels: travelNames,
                values: travelMeans,
                text: travelNames,
                hovertemplate: "Step: %{label} <br>Mean Time (mins): %{value}"
            });
            layout.title = "Total Travel Time by Step";
        }
        else if (props.fields === "other") {
            // should work too
            data.push({
                type: 'pie',
                labels: otherNames,
                values: otherMeans,
                text: otherNames,
                hovertemplate: "Step: %{label} <br>Mean Time (mins): %{value}"
            });
            layout.title = "Total Other Time by Step";
        }

        // customize layout for pie charts
        layout.height = 400;
        layout.width = props.noButtons ? 350 : 500;

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
        let mins = [];
        let maxes = [];

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

            // find range, min, and max
            let min = Number.MAX_SAFE_INTEGER;
            let max = Number.MIN_SAFE_INTEGER;
            for(const value of dataColumn.data) {
                min = Math.min(value, min);
                max = Math.max(value, max);
            }
            mins.push(min);
            maxes.push(max);
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

        // find the data to focus on
        let focusIndex = 0;
        let maxMean = Number.MIN_SAFE_INTEGER;
        for(let i = 0; i < means.length; i++) {
            if(means[i] > maxMean) {
                maxMean = means[i];
                focusIndex = i;
            }
        }
        let focusMin = mins[focusIndex];
        let focusMax = maxes[focusIndex];
        let focusName = processedData[focusIndex].name;
        sessionStorage.setItem("focusPillarRecommendation", `For this data, the minimum time is ${focusMin} minutes and the maximum time is ${focusMax} minutes. Standardization will allow us to standardize the minimum. Each person can now use this new standard. Theoretically making the average time equal to the minimum, in return making the overall lead time to decrease.`);
        sessionStorage.setItem("focusStackRecommendation", `The figure above shows the current mean times with the optimal ${focusName} time. This theoretical number can be achieved by performing kaizen events.`);

        // iterating through data set
        const recommendationSet = JSON.parse(sessionStorage.getItem(props.source + "Recommendations"));
        recommendationSet.push({
            id: "focuspillar",
            genericRecommendation: sessionStorage.getItem("focusPillarRecommendation")
        });
        recommendationSet.push({
            id: "focusstack",
            genericRecommendation: sessionStorage.getItem("focusStackRecommendation")
        });
        sessionStorage.setItem(props.source + "Recommendations", JSON.stringify(recommendationSet));


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
            layout.yaxis = {title: "Mean (mins)", range: [0, meanSum]};
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
        else if(props.fields === "focusPillar") {
            // main focus pillar chart info
            var meanFocusTrace = {
                x: [focusName],
                y: [means[focusIndex]],
                name: "Mean",
                type: "bar"
            };
            var stdvFocusTrace = {
                x: [focusName],
                y: [stdvs[focusIndex]],
                name: "Standard Dev.",
                type: "bar"
            };
            var rangeFocusTrace = {
                x: [focusName],
                y: [ranges[focusIndex]],
                name: "Range",
                type: "bar"
            };
            
            data.push(meanFocusTrace);
            data.push(stdvFocusTrace);
            data.push(rangeFocusTrace);
            //data = [meanTrace, stdvTrace, rangeTrace];

            layout.barmode = "group";
            layout.title = "Times (Focused)";
            layout.xaxis = {title: "Step"};
            layout.yaxis = {title: "Time (mins)"};

            // before stack data (stackedmeans)
            for(let i = 0; i < steps.length; i++) {
                dataBefore.push({
                    type: 'bar',
                    x: [""],
                    y: [means[i]],
                    name: steps[i],
                    hovertemplate: "Step: " + steps[i] + "<br>Mean Time (mins): %{y}",
                    width: 0.1
                });
            }

            layoutBefore.barmode = "stack";
            layoutBefore.title = "Mean Times Before (mins)";
            layoutBefore.yaxis = {title: "Mean (mins)", range: [0, meanSum]};

            layoutBefore.height = 400;
            layoutBefore.width = 400;

            // after stack data (focusStack)
            let adjustedMeans = means;
            adjustedMeans[focusIndex] = focusMin;
            for(let i = 0; i < steps.length; i++) {
                dataAfter.push({
                    type: 'bar',
                    x: [""],
                    y: [adjustedMeans[i]],
                    name: steps[i],
                    hovertemplate: "Step: " + steps[i] + "<br>Mean Time (mins): %{y}",
                    width: 0.1
                });
            }

            layoutAfter.barmode = "stack";
            layoutAfter.title = "Mean Times After (mins)";
            layoutAfter.yaxis = {title: "Mean (mins)", range: [0, meanSum]};

            layoutAfter.height = 400;
            layoutAfter.width = 400;

        }
        else if(props.fields === "focusStack") {
            let adjustedMeans = means;
            adjustedMeans[focusIndex] = focusMin;
            for(let i = 0; i < steps.length; i++) {
                data.push({
                    type: 'bar',
                    x: [""],
                    y: [adjustedMeans[i]],
                    name: steps[i],
                    hovertemplate: "Step: " + steps[i] + "<br>Mean Time (mins): %{y}",
                    width: 0.1
                });
            }

            layout.barmode = "stack";
            layout.title = "Mean Times by Step After Improvement (mins)";
            layout.yaxis = {title: "Mean (mins)", range: [0, meanSum]};
        }

        // customize layout for pillar charts
        layout.height = 400;
        layout.width = props.noButtons ? 350 : 500;
    }
    
    const CreateModal = (title, content) => {
        const modal = document.createElement("div");
      
        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal__inner">
                <div class="modal__top">
                    <div class="modal__title">${title}</div>
                    <button class="modal__close" type="button">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal__content"></div>
            </div>
        `;

        const modalContent = modal.querySelector(".modal__content");
        modalContent.appendChild(content);
      
        modal.querySelector(".modal__close").addEventListener("click", () => {
            document.body.removeChild(modal);
        });
      
        document.body.appendChild(modal);
    }

    let compareButton;
    let recButton;
    if (!props.noButtons) {
        if (JSON.parse(sessionStorage.getItem(props.source + "Datasets")) !== null) {
            compareButton = <button 
                onClick={() => {
                    const plot = [
                        <Chart chartType={props.chartType} fields={props.fields} id={props.id} source={props.source} datasetIndex={0} noButtons={true}/>,
                        <Chart chartType={props.chartType} fields={props.fields} id={props.id} source={props.source} datasetIndex={-2} noButtons={true}/>,
                        <Chart chartType={props.chartType} fields={props.fields} id={props.id} source={props.source} datasetIndex={-1} noButtons={true}/>,
                    ];
    
                    const content = document.createElement("div");
                    const modalCharts = document.createElement("div");
                    modalCharts.style.display = "flex";
                    content.appendChild(modalCharts);
    
                    ReactDOM.render(plot, modalCharts);
    
                    CreateModal(layout.title.text, content);
    
                }} style={{display : "inline-block"}}>
                    Compare
                </button>;
        }

        // making the rec button
        recButton = <button 
            onClick={() => {
                let text = document.createElement("p");
                text.style.display = "inline-block";

                // recommendations
                let recText = "Recommendations could not be loaded.";
                let recArray = JSON.parse(sessionStorage.getItem(props.source + "Recommendations"));
                let recObj = {};

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

                const plot = props.fields === "focusPillar" ? [
                    <Plot data = {data} layout = {layout}/>,
                    <Plot data = {dataBefore} layout = {layoutBefore}/>,
                    <Plot data = {dataAfter} layout = {layoutAfter}/>
                ] : <Plot data = {data} layout = {layout}/>;

                const content = document.createElement("div");
                const modalCharts = document.createElement("div");
                modalCharts.style.display = "flex";
                content.appendChild(modalCharts);

                ReactDOM.render(plot, modalCharts);
                content.appendChild(text);

                CreateModal(layout.title.text, content);

        }} style={{display : "inline-block"}}>
            Show Recommendation
        </button>
    }

    if(props.noButtons) {
        if(props.datasetIndex === -1) {
            layout.title = "Recent " + layout.title;
        }
        else if(props.datasetIndex === -2) {
            layout.title = "Previous " + layout.title;
        }
        else if(props.datasetIndex === -3) {
            layout.title = "Cumulative " + layout.title;
        }
        else {
            layout.title = "Initial " + layout.title;
        }
    }

    // this is the proper return
    return (
        <div className="graphWindow" id={props.id}>
            <Plot data = {data}

            layout = {layout}
            />
            
            {/* -- buttons that are drawn conditionally -- */}
            {recButton}
            {compareButton}

            <br />
            <label htmlFor={props.source + "-" + props.id + "-expert-rec-in"} id={props.source + "-" + props.id + "-expert-rec-in-label"} style={sessionStorage.getItem("expertView") ? {display: "block"} : {display: "none"}}>Input Expert Recommendation:</label>
            <textarea id={props.source + "-" + props.id + "-expert-rec-in"} name={props.source + "-" + props.id + "-expert-rec-in"} rows="2" cols="40" style={sessionStorage.getItem("expertView") ? {display: "block"} : {display: "none"}}/>
        </div>
    );
}

export default Chart;


