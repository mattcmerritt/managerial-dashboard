const FileUploader = () => {
    return (
        <div className="fileUploader">
            <form action="http://localhost:9000/upload" method='post' encType='multipart/form-data'>
                <label>Input Patient Data: </label>
                <input type='file' id='file' name='file' multiple></input>
                <label>Input Staff Data: </label>
                <input type='file' id='file' name='file' multiple></input>
                <button>Submit</button>
            </form>
        </div>
    );
}

export default FileUploader;