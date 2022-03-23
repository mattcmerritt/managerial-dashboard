import { Fragment } from "react";

const ChartWindow = (props) => {
    return (
        <Fragment>
            <div className="content">
                {
                    JSON.parse(sessionStorage.getItem("graphs")).map((data) => {
                        return data.element;
                    })
                }
            </div>
        </Fragment>
    );
}

export default ChartWindow;