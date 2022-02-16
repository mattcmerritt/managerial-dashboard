const Graph = (props) => {
    // const link = props["link"], h = props["h"], w = props["w"];

    // console.log(props);
    // console.log(link + "\n" + h + "\n" + w);

    return (
        <iframe id="igraph" scrolling="no" style={{border:'none'}} seamless="seamless" src={props.link} height={props.h} width={props.w}></iframe>
    );
}

export default Graph;