const Graph = (props) => {
    return (
        <div className="graphWindow" style={{display: "inline-block", width: "30%"}}>
            <button style={{display : (props.data.hasRec ? "inline-block" : "none")}}>Show Recommendation</button>
            <iframe id="igraph" scrolling="no" style={{border:'none'}} seamless="seamless" src={props.data.link} height='525' width='100%'></iframe>
        </div>
    );
}

export default Graph;