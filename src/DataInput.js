const DataInput = () => {
    let XLSX = require("xlsx");

    async function LoadFile(e) {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        // creating a promise to wait until we get div to make changes to it
        let dataImportDiv;
        const waitForDOM = new Promise((resolve, reject) => {
            dataImportDiv = document.getElementById("dataInSettings");
            console.log("Started here!");
    
            resolve();
        });

        waitForDOM.then(() => {
            // making changes to the div once it is loaded
            dataImportDiv.style.display = "block";
        });
    }

    return (
        <div className="dataIn">
            <input type="file" id="dataInForm" onChange={LoadFile}></input>
            <div className="dataInSettings" id="dataInSettings" style={{display: "none"}}>
                <p>
                    Data was successfully loaded!
                </p>
            </div>
        </div>
    )
}

export default DataInput;