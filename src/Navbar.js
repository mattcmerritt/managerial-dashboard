import React, { Component } from 'react';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    switchView() {

        let title, patientParent, altPatientParent, patientIn, patientCharts, altStaffParent, staffParent, staffIn, staffCharts;
        const ActiveView = new Promise((resolve, reject) => {
            title = document.getElementById("title");

            patientParent = document.getElementById("patientInputSelect");
            altPatientParent = document.getElementById("patientAdditionalData");
            patientIn = document.getElementsByClassName("patientDataIn")[0];
            patientCharts = document.getElementById("patientChartsDiv");
            
            staffParent = document.getElementById("staffInputSelect");
            altStaffParent = document.getElementById("staffAdditionalData");
            staffIn = document.getElementsByClassName("staffDataIn")[0];
            staffCharts = document.getElementById("staffChartsDiv");

            resolve();
        });
        
        ActiveView.then(() => {
            if (title.innerHTML.toLowerCase().indexOf("patient") !== -1) {
                title.innerHTML = "Managerial Dashboard - Staff Data";
                if (patientParent !== undefined && patientParent !== null) {
                    patientParent.style.display = "none";
                }
                if (altPatientParent !== undefined && altPatientParent !== null) {
                    altPatientParent.style.display = "none";
                }
                if (patientIn !== undefined) {
                    patientIn.style.display = "none";
                }
                if (patientCharts !== undefined && patientCharts !== null) {
                    patientCharts.style.display = "none";
                }
                
                if (staffParent !== undefined && staffParent !== null) {
                    staffParent.style.display = "block";
                }
                if (altStaffParent !== undefined && altStaffParent !== null) {
                    altStaffParent.style.display = "block";
                }
                if (staffIn !== undefined) {
                    staffIn.style.display = "block";
                }
                if (staffCharts !== undefined && staffCharts !== null)
                {
                    staffCharts.style.display = "flex";
                }
            } else {
                title.innerHTML = "Managerial Dashboard - Patient Data";
                if (patientParent !== undefined && patientParent !== null) {
                    patientParent.style.display = "block";
                }
                if (altPatientParent !== undefined && altPatientParent !== null) {
                    altPatientParent.style.display = "block";
                }
                if (patientIn !== undefined) {
                    patientIn.style.display = "block";
                }
                if (patientCharts !== undefined && patientCharts !== null) {
                    patientCharts.style.display = "flex";
                }
                
                if (staffParent !== undefined && staffParent !== null) {
                    staffParent.style.display = "none";
                }
                if (altStaffParent !== undefined && altStaffParent !== null) {
                    altStaffParent.style.display = "none";
                }
                if (staffIn !== undefined) {
                    staffIn.style.display = "none";
                }
                if (staffCharts !== undefined && staffCharts !== null) {
                    staffCharts.style.display = "none";
                }
            }
        });
    }

    loadRecFromFile(e) {
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

    activateExpertFields() {
        const areas = document.getElementsByTagName("textarea");

        for (const element of areas) {
            const id = element.id;
            const label = document.getElementById(id + "-label");

            element.style.display = "block";
            label.style.display = "block";
        }

        sessionStorage.setItem("expertView", true);
    }

    saveExpertRecommendations() {
        const recommendations = [
            {
                id: "patient",
                recs: []
            },
            {
                id: "staff",
                recs: []
            }
        ];
        
        const areas = document.getElementsByTagName("textarea");
        for (const area of areas) {
            // splitting the id into dataset, chartName, and the rest of the id
            const idParts = area.id.split("-");
            const dataset = idParts[0];
            const chartName = idParts[1];

            // if there is a recommendation, add it to the list
            if (area.value.trim() !== "") {
                const currentRec = {
                    chartId: chartName,
                    rec: area.value
                };

                for (const recSet of recommendations) {
                    if (recSet.id === dataset) {
                        recSet.recs.push(currentRec);
                    }
                }
            }
        }

        // creating the file
        const fileContents = JSON.stringify(recommendations);
        const blob = new Blob([fileContents], {type : 'octet-stream'});
        const fileDownloadUrl = URL.createObjectURL(blob);

        // making the link to download the file
        const downloadLink = document.createElement("a");
        downloadLink.href = fileDownloadUrl;
        downloadLink.style.display = "none";
        downloadLink.download = "expert-recommendations.txt";
        document.body.appendChild(downloadLink);

        // using the link and then removing it
        downloadLink.click();
        URL.revokeObjectURL(fileDownloadUrl);
        downloadLink.remove();

        // console.log(JSON.stringify(recommendations));
    }

    render() {
        return (
            <nav className="navbar">
                <h1 id="title">Managerial Dashboard - Patient Data</h1>
                <button onClick={this.switchView}>Switch Views</button>
                <div>
                    <label htmlFor="RecInput">Load in expert recommendations:</label>
                    <input type="file" id="RecInput" onChange={this.loadRecFromFile} accept=".txt"></input>
                    <p id="RecLoaded" style={{display: "none"}}>Expert recommendations successfully loaded from file.</p> 
                </div>
                <div className="expertControlPanel">
                    <button onClick={this.activateExpertFields}>Write Expert Recommendations</button> <br/>
                    <button onClick={this.saveExpertRecommendations}>Save Expert Recommendations</button>
                </div>
            </nav>
        );
    }
}

export default Navbar;