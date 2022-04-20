import React, { Component } from 'react';

class ExportData extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.exportData = this.exportData.bind(this);
    }

    componentDidMount() {

    }

    exportData() {
        // creating the file
        const datasetString = sessionStorage.getItem(this.props.group + "Dataset");        
        const blob = new Blob([datasetString], {type : 'octet-stream'});
        const fileDownloadUrl = URL.createObjectURL(blob);

        // making the link to download the file
        const downloadLink = document.createElement("a");
        downloadLink.href = fileDownloadUrl;
        downloadLink.style.display = "none";
        downloadLink.download = this.props.group + "Dataset.txt";
        document.body.appendChild(downloadLink);

        // using the link and then removing it
        downloadLink.click();
        URL.revokeObjectURL(fileDownloadUrl);
        downloadLink.remove();

        // console.log(JSON.stringify(recommendations));
    }

    render() {
        return (
            <div className={this.props.group + "DataExport"}>
                <button onClick={this.exportData}>Export Data</button>
            </div>
        )
    }
}

export default ExportData;