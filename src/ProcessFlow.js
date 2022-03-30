import { wasmFolder } from "@hpcc-js/wasm";

const ProcessFlow = (props) => {

    const CreateProcessFlow = async () => {
        // load data from storage
        const dataset = JSON.parse(sessionStorage.getItem(props.source + "Dataset"));
        
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

        //console.log(nodeMessages);

        let nodes = `start [shape="ellipse" label="Start"]`;
        for(let i = 0; i < nodeMessages.length; i++) {
            nodes += `node${i} [shape="rect" label="${nodeMessages[i]}"]\n\t\t`;
        }
        nodes += `end [shape="ellipse" label="End"]`;

        let connections = `start -> `;
        for(let i = 0; i < nodeMessages.length; i++) {
            connections += `node${i}\n\t\tnode${i} -> `;
        }
        connections += `end`;

        //console.log(nodes);

        const dot = `digraph processFlow {\n\t\t` + nodes + connections + `\n\t}`;

        //console.log(dot);
        return dot;
    };

    CreateProcessFlow().then((dot) => {
        const text = document.getElementById("description");
        text.innerHTML = dot;

        // wasmFolder(process.env.PUBLIC_URL.replace(/\.$/, '') + '@hpcc-js/wasm/dist');
        // this.graphviz = 
    });

    return (
        <div className="processFlow">
            <p id="description"></p>
        </div>
    );
}

export default ProcessFlow;