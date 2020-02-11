import React, { Component } from 'react';
// import axios from 'axios';
import { eventsHourly, eventsDaily, statsHourly, statsDaily, poi } from './data';
// import CanvasJSChart from './canvasjs.react';
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
        // use data as the x,y points for the graph
        // use variables to check which graph needs to be displayed
        const graphData = this.props.passVariables[0];
        console.log(graphData);

        // console.log(typeof data[0].events);

        // convert strings to numbers
        // data.forEach((item) => {
        //     item.events = parseInt(item.events)
        //     console.log(item.events);

        // })
        // console.log(data);

        // custom color palette
        Canvas.addColorSet('customColorSet', [
            // "#3183446",
            "#214A63",
            // "#06004f",
            "#005A84",
            "#3A4E6D",
            "#046FA0",
            "#39A0ED",
            "#7FC9FF"
        ])

        // put data in right format for graph
        const formattedData = {
            theme: 'dark1',
            title: {
                text: graphData.graphTitle
            },
            colorSet: 'customColorSet',
            data: [{
                type: graphData.graphType,
                dataPoints: []
            }],
            axisX: {
                title: graphData.axisXTitle,
                interval: 1,
                // intervalType: "day",
                labelAngle: 45,
                labelFontSize: 0
            },
            axisY: {
                title: graphData.axisYTitle,
                gridThickness: 0
            },
            showInLegend: graphData.showInLegend,
            legendText: graphData.legendText,
            legend: {
                dockInsidePlotArea: true,
                horizontalAlign: "right",
                verticalAlign: "center",
                fontSize: 15
            }
        };

        // update the formattedFata object -> will be used to set the graph options
        // formattedData.title.text = this.props.graphTitle
        // formattedData.axisX.title = this.props.axisXTitle
        // formattedData.axisY.title = this.props.axisYTitle
        // formattedData.data[0].type = this.props.graphType

        // add the x and y data points
        // label -> x data, y -> y data
        // dataPoints = [
        //   {label: "2017-01-02", y: 42},
        //   {label: "2017-01-03", y: 22}
        // ]


        // graphData.data.forEach((item, i) => {
        //     // console.log(item.date);
        //     // console.log(typeof item.events);
        //     formattedData.data[0].dataPoints[i] = {
        //         label: item[`date`],
        //         y: parseInt(item[`events`])
        //     }
        // })

        // add the graph data from App.js to the formattedData
        formattedData.data[0].dataPoints = graphData.data
        console.log(formattedData);

        // set the data into the graph options in state -> will cause the graph to re-render with the user seleced comparison data
        this.setState({
            options: formattedData
        })




        // GET DATA
        // remove the first item in the array and assign it to variableNames
        // i.e. now "eventsHourly" is just an array of the date/events
        // const variableNamesEventsHourly = eventsHourly.shift();
        // const variableNamesEventsDaily = eventsDaily.shift();
        // const variableNamesStatsHourly = statsHourly.shift();
        // const variableNamesStatsDaily = statsDaily.shift();
        // const variableNamesPoi = poi.shift();

        // PERFORM MATH ON DATA FOR USE IN GRAPHS (need totals and averages for hours and dates)
        // 1. GRAB ALL THE EVENTS FOR EACH DAY
        let events = {};
        let n = 1;
        let x = 0;
        eventsHourly.forEach((dateHourEvents, i) => {
            // want to start at n=1 for "-01"
            let regexstring = `2017-01-${x}${n}`;
            let regexp = new RegExp(regexstring);
            if (regexp.test(dateHourEvents[0])) {
                // matches 
                // check to see if the day is already in the object
                if (!events[dateHourEvents[0]]) {
                    // date is not in the object, add it
                    events[dateHourEvents[0]] = [dateHourEvents[2]]
                } else {
                    // date is in the object, push the next event into it
                    events[dateHourEvents[0]].push(dateHourEvents[2])
                }
            } else {
                // doesn't match
                // while the counter n <9, compare n of the current date string to the regex date (so that the date increments 01->09)
                if (n < 9) {
                    // TESTING AGAINST "N"
                    // convert the new date string into ar array
                    let newDateN = [...dateHourEvents[0]];
                    // grab the last character of the date string array
                    let newCharacterN = newDateN[newDateN.length - 1]
                    // convert the string into a number
                    const newCharacterNumberN = parseInt(newCharacterN);
                    // decrement that character
                    let oldCharacterN = newCharacterNumberN - 1;
                    // convert the number back into a string
                    const oldCharacterNumberN = oldCharacterN.toString()
                    // replace the last character of the new string with this decremented character
                    newDateN[newDateN.length - 1] = oldCharacterNumberN;
                    // convert the array back into a string
                    const oldDateN = newDateN.join("");

                    // if the oldDateN (previous date string with the -01 changed) matches the regex string, that means that it was the n count that changed => need to increment n to match 
                    if (regexp.test(oldDateN)) {
                        // increment n
                        n++
                    }
                } else if (n === 9) {
                    // if n=9, the counters need to be reset, so that they can start incermenting 10->
                    x = 1;
                    n = 0
                }
            }
        })
        // convert strings to numbers
        for (const event in events) {
            events[event].forEach((count) => {
                count = parseInt(count)
            })
        }
        eventsDaily.forEach((event) => {
            event[1] = parseInt(event[1])
        })

        // send data to the handleData() fxn
        // right now its just the data for total events per day
        // const data = {
        //     eventsDaily: eventsDaily
        // }
        // this.handleData(data)
    }

    handleButtonClick = () => {
        this.props.createNewGraph()
    }

    render() {
        return (
            <div className="graphContainer">
                <button onClick={this.handleButtonClick}>New Graph</button>
                <CanvasJSChart
                    options={this.state.options}
                    onRef={ref => this.chart = ref}
                />
                <div className="graphAnalysis">
                    <h3>Graphical Analysis</h3>
                    <p>{this.props.passVariables[1]}</p>
                </div>
            </div>
        )
    }
}

export default DisplayData;