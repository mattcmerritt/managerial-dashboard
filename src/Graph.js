const Graph = (props) => {
    return (
        <iframe id="igraph" scrolling="no" style={{border:'none'}} seamless="seamless" src={props.link} height='525' width='30%'></iframe>
    );
}

export default Graph;