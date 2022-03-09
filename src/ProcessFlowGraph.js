const ProcessFlowGraph = (props) => {
    var XLSX = require("xlsx");
    var hpccWasm = require("@hpcc-js/wasm/dist/index.min.js");

    const ExtractData = (workbook) => {
        
        //let workbook = XLSX.readFile(filepath);
        //let table = XLSX.utils.sheet_to_json(workbook)
        let worksheet = workbook.Sheets[workbook.SheetNames[0]]; // first sheet in workbook
        var range = XLSX.utils.decode_range(worksheet['!ref']); // range of sheet

        let colLetter = 'A';
        const starterLetterValue = colLetter.charCodeAt(0);
        let colLetterValue = starterLetterValue;
        
        let dataset = [];

        // https://www.npmjs.com/package/xlsx#working-with-the-workbook
        // ignore column 1 (Patient ID) for now
        for(let currCol = 0; currCol <= range.e.c; currCol++) {
            // first cell in a column is the name, so fetch that separately
            let nameCell = worksheet[colLetter + 1];
            let name = (nameCell ? nameCell.v : undefined);
            //console.log(name);

            // rest of the cells are values, so fetch and add to an array
            const dataArray = [];
            for(let currRow = 1; currRow < range.e.r; currRow++) {
                let dataCellAddress = colLetter + (currRow + 1);
                let dataCell = worksheet[dataCellAddress];
                let dataValue = (dataCell ? dataCell.v : undefined);
                dataArray.push(dataValue);
            }
            //console.log(dataArray);

            dataset.push(
                {
                    name: name,
                    data: dataArray,
                }
            );

            colLetterValue++;
            colLetter = String.fromCharCode(colLetterValue);
        }

        //console.log(dataset);
        return dataset;

    }

    const CreateProcessFlow = (processedData) => {

        processedData.shift(); // remove the first element - the Patient ID field

        // list of strings to use in the flowchart
        let nodeMessages = [];

        for(const column of processedData) {
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

        let nodes = ``;
        for(let i = 0; i < nodeMessages.length; i++) {
            nodes += `node${i} [label="${nodeMessages[i]}"]\n\t\t`;
        }
        for(let i = 0; i < nodeMessages.length-1; i++) {
            nodes += `\n\t\tnode${i} -> node${i+1}`;
        }

        //console.log(nodes);

        const dot = `
            digraph process-flow {\n\t\t` + nodes + `\n\t}`;

        console.log(dot);

        //console.log(hpccWasm.graphvizVersion());
        
        hpccWasm.graphvizSync().then(graphviz => {
            const div = document.getElementById("placeholder");
            div.innerHTML = graphviz.layout(dot, "svg", "dot");
        });
        
    }

    // reading file from the pages input form
    async function handleFileAsync(e) {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        CreateProcessFlow(ExtractData(workbook));
    }

    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <div id="placeholder"></div>
            <input type="file" id="pfInput" onChange={handleFileAsync}></input>
        </div>
    );
}

export default ProcessFlowGraph;


