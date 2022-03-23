import { Fragment } from "react";
import Graph from './Graph';

const GraphContainer = (props) => {
    return (
        <Fragment>
            <h1>{props.groupName}</h1>
            <div className="content">
                {
                    props.data.map((currentData) => {
                        return <Graph data={currentData}/>
                    })
                }
            </div>
        </Fragment>
    );
}

export default GraphContainer;