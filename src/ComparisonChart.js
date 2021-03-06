import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class ComparisonChart extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[], layout:{}};

        this.generateChart = this.generateChart.bind(this);
    }

    componentDidMount() {
        this.generateChart();
    }

    generateChart() {
        // fetch entire dataset
        const dataset = JSON.parse(sessionStorage.getItem("staffCompareDataset"));

        // search dataset for values we care about and filter them
        let relevantData = [];
        for(const point of dataset) {
            if(this.props.fields === "taskfocus" && point["task"] === this.props.focus) {
                relevantData.push(point);
            }
            else if(this.props.fields === "dayfocus" && point["day"] === this.props.focus) {
                relevantData.push(point);
            }
            else if(this.props.fields === "persontask" && point["staff member"] === this.props.focus && point["task"] === this.props.subfocus) {
                relevantData.push(point);
            }
        }

        // calculate values for charts based on type
        const data = [];
        const layout = {};

        if(this.props.fields === "taskfocus") {
            let staff = [];
            let sums = [];
            let counts = [];
            let means = [];

            for(const point of relevantData) {
                if(staff.includes(point["staff member"])) {
                    sums[staff.indexOf(point["staff member"])] += point["duration"];
                    counts[staff.indexOf(point["staff member"])]++;
                }
                else {
                    // first datapoint for a staff member, so start new entry in arrays
                    staff.push(point["staff member"]);
                    sums.push(point["duration"]);
                    counts.push(1);
                }
            }
            for(let i = 0; i < staff.length; i++) {
                means.push(sums[i] / counts[i]);
            }

            data.push({
                type: 'bar',
                x: staff, 
                y: means,
                name: "Mean Performance (mins)"
            });

            layout.barmode = "group";
            layout.title = "Staff Performance on " + this.props.focus;
            layout.xaxis = {title: "Staff Member"};
            layout.yaxis = {title: "Mean Time (mins)"};
        }
        else if(this.props.fields === "dayfocus") {
            let tasks = [];
            let sums = [];
            let counts = [];
            let means = [];

            for(const point of relevantData) {
                if(tasks.includes(point["task"])) {
                    sums[tasks.indexOf(point["task"])] += point["duration"];
                    counts[tasks.indexOf(point["task"])]++;
                }
                else {
                    // first datapoint for a task, so start new entry in arrays
                    tasks.push(point["task"]);
                    sums.push(point["duration"]);
                    counts.push(1);
                }
            }

            for(let i = 0; i < tasks.length; i++) {
                means.push(sums[i] / counts[i]);
            }

            data.push({
                type: 'bar',
                x: tasks, 
                y: means,
                name: "Mean Performance (mins)"
            });

            layout.barmode = "group";
            layout.title = "Staff Performance on " + this.props.focus;
            layout.xaxis = {title: "Task"};
            layout.yaxis = {title: "Mean Time (mins)"};
        }
        else if(this.props.fields === "persontask") {
            let days = [];
            let sums = [];
            let counts = [];
            let means = [];

            for(const point of relevantData) {
                if(days.includes(point["day"])) {
                    sums[days.indexOf(point["day"])] += point["duration"];
                    counts[days.indexOf(point["day"])]++;
                }
                else {
                    // first datapoint for a day, so start new entry in arrays
                    days.push(point["day"]);
                    sums.push(point["duration"]);
                    counts.push(1);
                }
            }

            for(let i = 0; i < days.length; i++) {
                means.push(sums[i] / counts[i]);
            }

            // sorting the days
            const dayWeights = {
                "sunday": 0,
                "monday": 1,
                "tuesday": 2,
                "wednesday": 3,
                "thursday": 4,
                "friday": 5,
                "saturday": 6,
            }
            for (let i = 0; i < days.length - 1; i++) {
                let min = i;
                for (let j = i + 1; j < days.length; j++) {
                    if (dayWeights[days[j].toLowerCase()] < dayWeights[days[min].toLowerCase()]) {
                        min = j;
                    }
                }
                let temp = days[i];
                days[i] = days[min];
                days[min] = temp;

                temp = sums[i];
                sums[i] = sums[min];
                sums[min] = temp;

                temp = counts[i];
                counts[i] = counts[min];
                counts[min] = temp;

                temp = means[i];
                means[i] = means[min];
                means[min] = temp;
            }

            data.push({
                type: 'bar',
                x: days, 
                y: means,
                name: "Mean Performance (mins)"
            });

            layout.barmode = "group";
            layout.title = "Daily Performance of " + this.props.focus + " on " + this.props.subfocus;
            layout.xaxis = {title: "Day"};
            layout.yaxis = {title: "Mean Time (mins)"};
        }

        layout.height = 400;
        layout.width = 500;

        this.setState({data: data, layout: layout});

    }

    render() {
        return (
            <div className="graphWindow" id={this.props.id}>
                <Plot data={this.state.data} layout={this.state.layout}/>
            </div>
        );        
    }
}

export default ComparisonChart;