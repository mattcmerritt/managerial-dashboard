const RecWindow = (props) => {
    return (
        <div className="recWindow" id="recWindow" style={{display: "none"}}>
            <button onClick={ () => {
                const win = document.getElementById("recWindow");
                win.style = "display: none;";
            }}>Close</button>
            <p>Not much to add yet.</p>
        </div>
    );
}

export default RecWindow;