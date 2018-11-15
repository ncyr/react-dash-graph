import React, { Component } from "react";
import Chart from "./chart";

class Dash extends Component {
    state = {};
    render() {
        return (
            <div id="chart-row-1">
                <div id="left-side" className="float-left">
                    <Chart type="cpu" id="32" />
                </div>
                <div id="right-side">
                    <Chart type="memory" id="32" />
                </div>
                <div className="clearfix" />
            </div>
        );
    }
}

export default Dash;
