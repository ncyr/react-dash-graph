//Chart will bring ALL chart data to be presented all in one json per request for a given host
//this way we wont have one request for each chart type and they will update all togther.
//Reqs:
//1. API KEY
//2. Host ID
//3.

import React, { Component } from "react";
import { VictoryChart, VictoryArea } from "victory";

const APIBASEURL = "http://localhost:8000/heartbeat/api/";
const APIKEY = "0987612345ZYXW";
var json_data = false;
//var graph_data = false;
class Chart extends Component {
    state = {
        data: [],
        time: ""
    };

    constructor(request) {
        super(); //using arrow fucntions for bind
    }

    //basic request handler
    handleRequest = url => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status) {
                json_data = xhttp.responseText;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
        return json_data;
    };
    getGraphData = graph => {
        //rebind for setInterval scope
        var self = this;
        var url = APIBASEURL + type + "/" + graph.id + "/" + APIKEY + "/";
        var type = false;
        setInterval(function(e) {
            var graph_data = self.handleRequest(url);
            var vic_format = [];
            JSON.parse(graph_data, function(key, value) {
                if (key === "system_info") {
                    var json_str = JSON.stringify(value)
                        .replace(/"/g, "")
                        .replace(/'/g, '"');

                    var obj = JSON.parse(json_str);

                    var created_at = new Date(obj.created_at);
                    var seconds = created_at.getSeconds();

                    type = graph.type + "_usage";

                    vic_format.push(
                        {
                            x: seconds, //time in s, m, h
                            y: 0, //ground level
                            y0: obj[type] //percent use
                        }
                        // test data
                        // { x: 20, y: 0, y0: 60 },
                        // { x: 45, y: 0, y0: 46 },
                        // { x: 50, y: 0, y0: 25 },
                        // { x: 55, y: 0, y0: 18 },
                        // { x: 60, y: 0, y0: 19 }
                    );
                }
            });

            self.setState({
                data: vic_format
            });
            //do something with the data each time we get it, like update state
        }, 1000);
    };
    render() {
        var type = this.props.type;
        var id = this.props.id;
        return (
            <div>
                <div id="Charts" className="container mx-auto">
                    <h5>{type} usage</h5>
                    <button onClick={e => this.getGraphData({ type, id })}>
                        Set New State Manually
                    </button>
                    <div className="row">
                        <div className="col">
                            <div id="usage" className="" />
                            <VictoryChart>
                                <VictoryArea
                                    id={type}
                                    standalone={"false"}
                                    width={100}
                                    height={100}
                                    padding={0}
                                    data={this.state.data}
                                />
                            </VictoryChart>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chart;
