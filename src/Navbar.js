const Navbar = () => {

    const SwitchView = async () => {

        let title, patientIn, patientCharts, staffIn, staffCharts;
        const ActiveView = new Promise((resolve, reject) => {
            title = document.getElementById("title");
            patientIn = document.getElementsByClassName("patientDataIn")[0];
            patientCharts = document.getElementById("patientChartsDiv");
            staffIn = document.getElementsByClassName("staffDataIn")[0];
            staffCharts = document.getElementById("staffChartsDiv");

            resolve();
        });
        
        ActiveView.then(() => {
            if (patientCharts.style.display === "flex") {
                title.innerHTML = "Managerial Dashboard - Staff Data";
                if (patientIn !== undefined) {
                    patientIn.style.display = "none";
                }
                patientCharts.style.display = "none";

                if (staffIn !== undefined) {
                    staffIn.style.display = "block";
                }
                staffCharts.style.display = "flex";
            } else {
                title.innerHTML = "Managerial Dashboard - Patient Data";
                if (patientIn !== undefined) {
                    patientIn.style.display = "block";
                }
                patientCharts.style.display = "flex";

                if (staffIn !== undefined) {
                    staffIn.style.display = "none";
                }
                staffCharts.style.display = "none";
            }
        });
    }

    const LoadRecFromFile = async (e) => {
        let label, form, formLabel;
        let dataGroup;

        const GetLabel = new Promise((resolve, reject) => {
            label = document.getElementById("RecLoaded");
            form = document.getElementById("RecInput");
            formLabel = document.getElementsByTagName("label")[0];

            let patientCharts = document.getElementById("patientChartsDiv");
            dataGroup = patientCharts.style.display !== "none" ? "patient" : "staff";

            resolve();
        });

        GetLabel.then(() =>  {
            label.style.display = "flex";
            form.style.display = "none";
            formLabel.style.display = "none";

            // reading from file
            let recsFromFile;
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                recsFromFile = fileReader.result;

                // saving to memory (if graphs are not generated)
                sessionStorage.setItem("expertRecommendations", recsFromFile);
                
                // saving to sessionstorage (if graphs are generated)
                // applying to graphs (if graphs are generated)
                const recArray = JSON.parse(recsFromFile);

                for (let recSet of recArray) {

                    // overwriting data in session storage
                    const data = JSON.parse(sessionStorage.getItem(recSet.id + "Recommendations"));
                    
                    if (data === null) {
                        continue;
                    }

                    for (let chart of recSet.recs) {
                        let chartsDiv, currentGraphDiv, pTag
                        const GetHTMLElements = new Promise((resolve, reject) => {
                            chartsDiv = document.getElementById(recSet.id + "ChartsDiv");
                            
                            const GetCurrentGraph = new Promise((resolve, reject) => {
                                currentGraphDiv = chartsDiv.querySelector(`#${chart.chartId}`);
                                resolve();
                            });
                            
                            GetCurrentGraph.then(() => {
                                pTag = currentGraphDiv.querySelector("p");
                            });

                            resolve();
                        });
                        
                        let recObj;
                        // finding recommendations object in data array
                        for (let rec of data) {
                            if (rec.id === chart.chartId) {
                                recObj = rec;
                                // overwriting expert recommendation
                                rec.expertRecommendation = chart.rec;
                            }
                        }

                        let recText;
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

                        GetHTMLElements.then(() => {
                            pTag.innerHTML = recText;
                        });
                    }

                    // updating storage with overwrites
                    sessionStorage.setItem(recSet.id + "Recommendations", JSON.stringify(data));
                }
                
            };
            fileReader.readAsText(e.target.files[0]);
        });
    }

    return (
        <nav className="navbar">
            <h1 id="title">Managerial Dashboard - Patient Data</h1>
            <button onClick={SwitchView}>Switch Views</button>
            <div>
                <label htmlFor="RecInput">Load in expert recommendations:</label>
                <input type="file" id="RecInput" onChange={LoadRecFromFile} accept=".txt"></input>
                <p id="RecLoaded" style={{display: "none"}}>Expert recommendations successfully loaded from file.</p> 
            </div>
            
            
        </nav>
    );
}

export default Navbar;