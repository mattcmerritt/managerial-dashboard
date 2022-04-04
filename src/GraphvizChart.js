import React, { Component } from 'react';

class GraphvizChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.containerRef = React.createRef();
        this.viz = props.viz;
    }

    updateDisplay() {
        const { src, engine } = this.props;
        
        let render;

        render = this.viz.renderSVGElement(src, { engine });

        render.then(element => {
            this.setState({text: null, element, error: null });
        });

        console.log("Updating display");
    }

    componentDidMount() {
        this.updateDisplay();
        console.log("In mount");
    }

    componentDidUpdate() {
        this.containerRef.current.appendChild(this.state.element);
        console.log("In update");
    }

    render() {
        return (
            <div className={this.props.data + "-viz-chart"}>
                <div className="element" ref={this.containerRef}></div>
            </div>
        );
    }
}

export default GraphvizChart;