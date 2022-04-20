import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EnhancedDataInput from "./EnhancedDataInput";

class InputSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.group = props.group;
        this.enabled = props.enabled;
        this.viz = props.viz;

        this.showFirstTimeInput = this.showFirstTimeInput.bind(this);
        this.showRepeatInput = this.showRepeatInput.bind(this);
        this.removeElements = this.removeElements.bind(this);
    }

    showFirstTimeInput() {
        this.removeElements();

        const inputSelectDiv = document.getElementById(this.group + "InputSelect");

        // to prevent the ReactDOM from overwriting, elements need to be contained in
        // their own div
        const div1 = document.createElement("div");
        inputSelectDiv.appendChild(div1);
        const div2 = document.createElement("div");
        inputSelectDiv.appendChild(div2);

        const dataInput = <EnhancedDataInput group={this.group} enabled={true} viz={this.viz} />;
        const chartDiv = <div className={this.group + "Charts"} id={this.group + "ChartsDiv"} style={true ? {display: "flex"} : {display: "none"}} />;
        
        ReactDOM.render(dataInput, div1);
        ReactDOM.render(chartDiv, div2);
    }

    showRepeatInput() {
        this.removeElements();

        const inputSelectDiv = document.getElementById(this.group + "InputSelect");

        // to prevent the ReactDOM from overwriting, elements need to be contained in
        // their own div
        const div1 = document.createElement("div");
        inputSelectDiv.appendChild(div1);
        const div2 = document.createElement("div");
        inputSelectDiv.appendChild(div2);

        const chartDiv = <div className={this.group + "Charts"} id={this.group + "ChartsDiv"} style={true ? {display: "flex"} : {display: "none"}} />;

        const item = <p>This is temporary</p>;

        ReactDOM.render(item, div1);
        ReactDOM.render(chartDiv, div2);
    }

    removeElements() {
        const inputSelectDiv = document.getElementById(this.group + "InputSelect");
        const instructions = inputSelectDiv.querySelector("p");
        const buttons = inputSelectDiv.querySelectorAll("button");

        instructions.remove();
        for (const button of buttons) {
            button.remove();
        }
    }

    render() {
        return (
            <div className={this.group + "InputSelect"} id={this.group + "InputSelect"} style={this.enabled ? {display: "block"} : {display: "none"}}>
                <p>If this is your first time using the dashboard, select "First time".<br />If you are a returning user and have a dataset, select "Returning user".</p>
                <button onClick={this.showFirstTimeInput}>First time</button>
                <button onClick={this.showRepeatInput}>Returning user</button>
            </div>
        )
    }
}

export default InputSelection;