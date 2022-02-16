const Graph = (props) => {
    return (
        <iframe id="igraph" scrolling="no" style={{border:'none'}} seamless="seamless" src={props.link} height={props.h} width={props.w}></iframe>
    );
}

export default Graph;