import React, { Component } from 'react';
import { eventsHourly, eventsDaily, statsHourly, statsDaily, poi } from './data';
import CanvasJS from './canvasjs.react'
const Canvas = CanvasJS.CanvasJS;
const CanvasJSChart = CanvasJS.CanvasJSChart;


class DisplayData extends Component {
    constructor() {
        super();
        this.state = {
            data: {
                eventsDaily: []
            },
            options: {}
        }
    }

    componentDidMount() {
        // grab selected data for graph
        const graphData = this.props.passVariables[0];
        // custom color palette for graph
        Canvas.addColorSet('customColorSet', [
            "#214A63",
            "#005A84",
            "#3A4E6D",
            "#046FA0",
            "#39A0ED",
            "#7FC9FF"
        ])
        // put data in right format for graph
        const formattedData = {
            // theme: 'dark1',
            backgroundColor: "#000000",
            title: {
                text: graphData.graphTitle,
                fontFamily: 'sans-serif',
                fontColor: 'whitesmoke',
                fontSize: 20
            },
            colorSet: 'customColorSet',
            legend: {
                verticalAlign: "top",
                horizontalAlign: "right",
                fontColor: 'red',
                dockInsidePlotArea: false
            },
            data: [{
                type: graphData.graphType,
                dataPoints: []
                },
                {
                type: 'spline',
                showInLegend: graphData.showInLegend,
                lineColor: "red",
                markerColor: "red",
                dataPoints: [],
                legendText: graphData.legendText
                }
            ],
            axisX: {
                title: graphData.axisXTitle,
                interval: 1,
                labelAngle: 45,
                labelFontSize: 0,
                lineColor: 'white',
                tickColor: 'white',
                titleFontColor: 'white'
            },
            axisY: {
                title: graphData.axisYTitle,
                gridThickness: 0,
                lineColor: 'white',
                gridColor: 'white',
                tickColor: 'white',
                titleFontColor: 'white'
            },
            showInLegend: graphData.showInLegend,
            legendText: graphData.legendText,
        };

        // add the graph data from App.js to the formattedData
        formattedData.data[0].dataPoints = graphData.data
        formattedData.data[1].dataPoints = graphData.curveFit

        // set the data into the graph options in state -> will cause the graph to re-render with the user seleced comparison data
        this.setState({
            options: formattedData
        })
    }

    handleButtonClick = () => {
        this.props.createNewGraph()
    }

    render() {
        return (
            <div className="graphContainer">
                <CanvasJSChart
                    options={this.state.options}
                    onRef={ref => this.chart = ref}
                />
                <div class="bottomContainer">
                    <div className="graphAnalysis">
                        <h3>Graphical Analysis</h3>
                        <p>{this.props.passVariables[1]}</p>
                    </div>
                    <button onClick={this.handleButtonClick}>New Graph</button>
                </div>
            </div>
        )
    }
}

export default DisplayData;