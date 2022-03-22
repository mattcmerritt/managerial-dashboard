const DataInput = () => {
    let XLSX = require("xlsx");

    const LoadFile = async (e) => {
        console.log("Loading data");
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        return workbook;
    }

    const ExtractData = async (workbook) => {
        console.log("Extracting data");
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];    // first sheet in workbook
        var range = XLSX.utils.decode_range(worksheet['!ref']);     // range of sheet

        let colLetter = 'A';
        const starterLetterValue = colLetter.charCodeAt(0);
        let colLetterValue = starterLetterValue;
        
        let dataset = [];

        // https://www.npmjs.com/package/xlsx#working-with-the-workbook
        for(let currCol = 0; currCol <= range.e.c; currCol++) {
            // first cell in a column is the name, so fetch that separately
            let nameCell = worksheet[colLetter + 1];
            let name = (nameCell ? nameCell.v : undefined);

            // rest of the cells are values, so fetch and add to an array
            const dataArray = [];
            for(let currRow = 1; currRow < range.e.r; currRow++) {
                let dataCellAddress = colLetter + (currRow + 1);
                let dataCell = worksheet[dataCellAddress];
                let dataValue = (dataCell ? dataCell.v : undefined);
                dataArray.push(dataValue);
            }

            dataset.push(
                {
                    name: name,
                    data: dataArray,
                }
            );

            colLetterValue++;
            colLetter = String.fromCharCode(colLetterValue);
        }

        return dataset;
    }

    const ShowDataSettings = async (dataset) => {
        console.log("Showing import settings");
        // creating a promise to wait until we get div to make changes to it
        let dataImportDiv;
        const waitForDOM = new Promise((resolve, reject) => {
            dataImportDiv = document.getElementById("dataInSettings");
    
            resolve();
        });

        waitForDOM.then(() => {
            // making changes to the div once it is loaded
            dataImportDiv.style.display = "block";
        });
    }

    const ProcessDataset = async (e) => {
        console.log("Processing");
        const load = new Promise((resolve, reject) => {
            let workbook = LoadFile(e);

            resolve(workbook);
        });

        const extract = new Promise((resolve, reject) => {
            let dataset = load.then((workbook) => ExtractData(workbook));

            resolve(dataset);
        });
        
        extract.then((dataset) => ShowDataSettings(dataset)); 
    }

    return (
        <div className="dataIn">
            <input type="file" id="dataInForm" onChange={ProcessDataset}></input>
            <div className="dataInSettings" id="dataInSettings" style={{display: "none"}}>
                <p>
                    Data was successfully loaded!
                </p>
            </div>
        </div>
    )
}

export default DataInput;