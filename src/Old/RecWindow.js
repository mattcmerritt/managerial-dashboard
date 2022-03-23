const RecWindow = (props) => {
    return (
        <div className="recWindow" id="recWindow" style={{display: "none"}}>
            <button onClick={ () => {
                const win = document.getElementById("recWindow");
                win.style = "display: none;";
            }}>Close</button>
            <p id="recText">Nothing has been loaded to display.</p>
        </div>
    );
}

export default RecWindow;