import React, { Component } from 'react';
import Chart from './Chart';
import GraphvizChart from './GraphvizChart';
import ExportData from './ExportData';
import ReactDOM from 'react-dom';
import AdditionalDataInput from './AdditionalDataInput';
import ComparisonChart from './ComparisonChart';

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.GenerateCharts = this.GenerateCharts.bind(this);
        this.GenerateRecommendations = this.GenerateRecommendations.bind(this);
        this.CreateProcessFlow = this.CreateProcessFlow.bind(this);
    }

    // builds out the specific charts for the given dataset using the
    // Chart and GraphvizChart components
    async GenerateCharts() {
        if (this.props.group === "patient") {
            const dot = await this.CreateProcessFlow();

            const charts = [
                <GraphvizChart src={dot} engine={"dot"} viz={this.props.viz} data={this.props.group} title="Patient Process Flow Diagram" />,
                <Chart chartType="pie" fields="categories" id="pie1" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pie" fields="care" id="pie2" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pie" fields="wait" id="pie3" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="steps" id="pillar1" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="stackedmeans" id="pillar2" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="stackedmeanpercents" id="pillar3" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="focusPillar" id="focuspillar" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="focusStack" id="focusstack" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
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
            
            // adding the data exporter
            const temp = document.createElement("div");
            parentChartDiv.appendChild(temp);

            const dataExporter = <ExportData group={this.props.group} />;
            ReactDOM.render(dataExporter, temp);

            // adding the additional data input option
            const temp2 = document.createElement("div");
            parentChartDiv.appendChild(temp2);
            
            const additionalData = <AdditionalDataInput group={this.props.group} viz={this.props.viz} />;
            ReactDOM.render(additionalData, temp2);
        }
        else if (this.props.group === "staff") {
            const dot = await this.CreateProcessFlow();

            const charts = [
                <GraphvizChart src={dot} engine={"dot"} viz={this.props.viz} data={this.props.group} title="Staff Process Flow Diagram" />,
                <Chart chartType="pie" fields="categories" id="pie1" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pie" fields="care" id="pie2" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pie" fields="travel" id="pie3" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="steps" id="pillar1" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="stackedmeans" id="pillar2" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="stackedmeanpercents" id="pillar3" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="focusPillar" id="focuspillar" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
                <Chart chartType="pillar" fields="focusStack" id="focusstack" source={this.props.group} datasetIndex={this.props.cumulative ? -3 : -1}/>,
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
            
            // adding the data exporter
            const temp = document.createElement("div");
            parentChartDiv.appendChild(temp);

            const dataExporter = <ExportData group={this.props.group} />;
            ReactDOM.render(dataExporter, temp);

            // adding the additional data input option
            const temp2 = document.createElement("div");
            parentChartDiv.appendChild(temp2);
            
            const additionalData = <AdditionalDataInput group={this.props.group} viz={this.props.viz} />;
            ReactDOM.render(additionalData, temp2);
        }
        else if (this.props.group === "staffCompare") {
            // grabbing the list of unique values
            const values = JSON.parse(sessionStorage.getItem(this.props.group + "Values"));

            // generating a chart for each unique value
            const charts = [];

            // task-focused charts
            for (const task of values["task"]) {
                const chart = <ComparisonChart fields="taskfocus" focus={task} id={"task" + task}/>;
                charts.push(chart);
            }
            // day-focused charts
            for (const day of values["day"]) {
                const chart = <ComparisonChart fields="dayfocus" focus={day} id={"day" + day}/>;
                charts.push(chart);
            }
            // individual performance per task over the week
            for (const task of values["task"]) {
                for (const member of values["staff member"]) {
                    const chart = <ComparisonChart fields="persontask" focus={member} subfocus={task} id={member + task}/>;
                    charts.push(chart);
                }
            }

            console.log(charts);
    
            // rendering the charts
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
                genericRecommendation: "This chart shows what percent of the total care time experienced by a patient each care step is.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pie3",
                genericRecommendation: "This chart shows what percent of the total wait experienced by a patient each wait step is.",
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
                genericRecommendation: "This chart shows what percent of the total care time for a staff member each care step is.",
                expertRecommendation: undefined
            });
            recommendations.push({
                id: "pie3",
                genericRecommendation: "This chart shows what percent of the total travel time for a staff member each travel step is.",
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

        // mapping node0 to the name of first step and so on
        const childMappings = {"End": "end"};
        for (let i = 0; i < nodeMessages.length; i++) {
            childMappings[dataset[i].name] = "node" + i;
        }

        let connections = ``;
        if (nodeMessages.length === 0) {
            connections = `start -> end`;
        }
        else {
            connections += `start -> node0`;
            for (let i = 0; i < nodeMessages.length; i++) {
                for (let j = 0; j < dataset[i].nextSteps.length; j++) {
                    connections += `\n\tnode${i} -> ${childMappings[dataset[i].nextSteps[j]]}`;
                }
            }
        }

        const dot = `digraph processFlow {\n\trankdir="LR"\n\tsize=17.5\n\tratio="compress"\n\t` + nodes + "\n\t" + connections + `\n}`;

        return dot;
    }

    render() {
        this.GenerateCharts();
        this.GenerateRecommendations();

        return (
            <div></div>
        );
    }
}

export default ChartContainer;