import { Fragment } from "react";
import Graph from './Graph';

const GraphContainer = (props) => {
    return (
        <Fragment>
            <h1>{props.groupName}</h1>
            <div className="content">
                {
                    props.links.map((currentLink) => {
                        return <Graph link={currentLink}/>
                    })
                }
            </div>
        </Fragment>
    );
}

export default GraphContainer;