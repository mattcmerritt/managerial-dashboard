const Graph = (props) => {
    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <button onClick={ (e) => {
                const win = document.getElementById("recWindow");

                win.style = "display: inline-block";

                let x = e.clientX - win.offsetWidth/2;
                let y = e.clientY - win.offsetHeight/2;

                console.log(`display: inline-block; left: ${x}px; top: ${y};`);

                win.style = `display: inline-block; left: ${x}px; top: ${y}px;`;
            }} 
            style={{display : (props.data.hasRec ? "inline-block" : "none")}}>Show Recommendation</button>
            <iframe id="igraph" scrolling="no" style={{border:'none'}} seamless="seamless" src={props.data.link} height='525' width='100%'></iframe>
        </div>
    );
}

export default Graph;