import React, { Component } from 'react';

class SelectData extends Component {
    constructor() {
        super();
        this.state = {
            poiSelected: false,
            checkboxesSelected: {},
            selectedVariables: [],
            selector: {
                average: false,
                total: false
            }
        }
    }

    componentDidMount = () => {
        // grab the data from the diff end points
        // fetch('/events/daily', {
        //     // accept: "application/json"
        // })
        // .then(res => res.json())
        // .then((data) => {
        //     console.log(data);
        // })

        // fetch('/events/hourly', {
        //     // accept: "application/json"
        // })
        // .then(res => res.json())
        // .then((data) => {
        //     console.log(data);
        // })

        // fetch('/stats/daily', {
        //     // accept: "application/json"
        // })
        // .then(res => res.json())
        // .then((data) => {
        //     console.log(data);
        // })

        // fetch('/stats/hourly', {
        //     // accept: "application/json"
        // })
        // .then(res => res.json())
        // .then((data) => {
        //     console.log(data);
        // })

        // // POI 
        // fetch('/poi', {
        //     // accept: "application/json"
        // })
        // .then(res => res.json())
        // .then((data) => {
        //     console.log(data);
        // })
    }

    handlePoiChange = (event) => {
        alert("The only graphs that are currently displaying: Total Events vs Date & Average Events vs. Hour")
        this.setState({
            poiSelected: true
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // grab all of the checkboxes (convert from HTMLCollection to an array using spread operator)
        let checkBoxes = [...document.getElementsByClassName("checkbox")];
        // grab all the extra selectors checkboxes
        let selectors = [...document.getElementsByClassName("selectorRadio")]
        // filter out the checkboxes that were checked & grab their values
        const checkboxValues = checkBoxes.filter((checkbox) => {
            return checkbox.checked
        }).map((checkbox) => {
            return checkbox.value
        })

        // conditional that at least 2 checkboxes are chosen, but nore more than 3 are chosen
        if (checkboxValues.length < 2) {
            alert("You need to choose at least two variables to create a graph, please select again.")
            // reset the boxes
            checkBoxes.forEach((checkbox) => {
                checkbox.checked = false;
            })
            // reset the checkboxes
            this.setState({
                checkboxesSelected: {},
                selector: {
                    average: false,
                    total: false
                }
            })
        } else if (checkboxValues.length > 3) {
            alert("You cannot choose more than three variables, please select again.")
            // reset the boxes
            checkBoxes.forEach((checkbox) => {
                checkbox.checked = false;
            })
            // reset the checkboxes
            this.setState({
                checkboxesSelected: {},
                selector: {
                    average: false,
                    total: false
                }
            })
        } else {
            // an allowed number of variables was slected, save the checkboxValues to state, reset the boxes, and call function to handle the data

            // need to check that if TWO checkboxes were selected, that it wasn't date & hour
            if (checkboxValues.length === 2 && checkboxValues.includes("date") && checkboxValues.includes("hour")) {
                // if user selected just date and hour
                alert("You cannot choose only date and hour for graphical comparison, please select again.");
                // reset boxes
                checkBoxes.forEach((checkbox) => {
                    checkbox.checked = false;
                })
            } else {
                // if user did not select just date and hour => they selected an appropriate combination of checkboxes
                if (this.state.selector.normal) {
                    // user selected "normal"
                    // console.log(`I selected normal`);
                    if (checkboxValues.includes("date") && checkboxValues.includes("hour")) {
                        // user selected date + hour => correct combo
                        // console.log(`I chose correct`);
                        let data = {};
                        data.checkboxValues = checkboxValues;
                        data.selector = this.state.selector;
                        // console.log(data);
                        // send the data to the handleData() fxn 
                        this.handleData(data)
                    } else {
                        // console.log(`I chose incorrect`);
                        // user did not select date + hour => incorrect combo
                        alert("Events-Normal can only be combined with date + hour, please select again.")
                    }
                    // reset boxes
                    checkBoxes.forEach((checkbox) => {
                        checkbox.checked = false;
                    })
                    this.setState({
                        // reset the checkboxes and radio inputs
                        checkboxesSelected: {},
                        selector: {
                            normal: false,
                            average: false,
                            total: false
                        }
                    })
                } else {
                    // console.log(`I did not select normal`);
                    // user did not select "normal"
                    // check that if events, impressions, clicks, or revenue were chosen, that they have also chosen a selector average or total
                    if (this.state.selector.average || this.state.selector.total) {
                        // console.log(`I selected avg or total`);
                        // the user either selected average or total

                        // if the user selected date + events-average
                        if (checkboxValues.includes("date") && this.state.selector.average) {
                            alert("You cannot use Date + Hours + Events-Average, or Date + Events-Average for graphical comparison, please select again.")
                            // the user did not select date + events-average
                        } else {
                            // console.log(`I did not choose  date + evnt`);
                            let data = {};
                            data.checkboxValues = checkboxValues;
                            data.selector = this.state.selector;

                            // send the data to the handleData() fxn 
                            // console.log(data);
                            this.handleData(data)
                        }

                        this.setState({
                            // moved the handleData() into the DisplayData component, need to account for this here in SelectData component so that the data gets passed
                            // need the selectedVariables here?????
                            // selectedVariables: checkboxValues,
                            // reset the checkboxes and radio inputs
                            checkboxesSelected: {},
                            selector: {
                                normal: false,
                                average: false,
                                total: false
                            }
                        })
                        // reset boxes
                        checkBoxes.forEach((checkbox) => {
                            checkbox.checked = false;
                        })
                    } else {
                        // else the user did not select  average or total
                        alert("For events, impressions, clicks, and revenue, you must select either normal, average or total. Please select again.");
                        // reset boxes
                        checkBoxes.forEach((checkbox) => {
                            checkbox.checked = false;
                        })
                        // reset the checkboxes
                        this.setState({
                            checkboxesSelected: {}
                        })
                    }
                }
            }
        }
    }

    handleData = (variables) => {
        // determine what combination can be done with the selected checkboxes 
        // determine what data to request from the api

        // if the user chose "events" as one of the variables, go into either the Events Graphs or Event & Stats Graphs options
        if (variables.checkboxValues.includes("events")) {
            // user chose "events"

            // this.props.getVariables(variables)

            // if the user chose "impressions", "clicks", or "revenue" as one of the variables, go into the Events & Stats Graphs
            if (variables.checkboxValues.includes("impressions") ||
                variables.checkboxValues.includes("clicks") ||
                variables.checkboxValues.includes("revenue")) {
                // call the fxn passed down in props to pass the variables chosen by the user up to app.js 
                this.props.getVariables(variables)

                // 3. Combined Events & Stats Graphs
                if (variables.checkboxValues.includes("impressions")) {

                    if (variables.selector.total) {
                        // total events vs total impressions, for each day
                        // console.log(`total impressions`);
                        this.handleApiCall('events', 'daily', 'stats')

                    } else if (variables.selector.average) {
                        // avg events vs avg impressions, for each hour
                        // console.log(`average impressions`);
                        this.handleApiCall('events', 'hourly', 'stats')
                    }
                } else if (variables.checkboxValues.includes("clicks")) {

                    if (variables.selector.total) {
                        // total clicks vs total events, for each day
                        // console.log(`total clicks`);
                        this.handleApiCall('events', 'daily', 'stats')

                    } else if (variables.selector.average) {
                        // avg clicks vs avg events, for each hour
                        // console.log(`average clicks`);
                        this.handleApiCall('events', 'hourly', 'stats')
                    }

                } else if (variables.checkboxValues.includes("revenue")) {

                    if (variables.selector.total) {
                        // total revenue vs total events, for each day
                        // console.log(`total revenue`);
                        this.handleApiCall('events', 'daily', 'stats')

                    } else if (variables.selector.average) {
                        // avg revenue vs avg events, for each hour
                        // console.log(`average revenue`);
                        this.handleApiCall('events', 'hourly', 'stats')
                    }
                }
                // if the user did not chose "impressions", "clicks", or "revenue" as one of the variables, go into the Events Graphs
            } else {
                // this.props.getVariables(variables)

                // 1. Event Graphs
                if (variables.checkboxValues.includes("date") && variables.checkboxValues.includes("hour")) {
                    // grab the data from the api (request from the /events/hourly endpoint)
                    // can store the results from the api call and manipulate data here
                    // THEN call a fxn to pass this data to app -> DisplayData
                    // date vs events per hour
                    // # of events over the course of a day, for each day
                    this.handleApiCall('events', 'hourly')
                    // ***LEAVE OUT FOR NOW (need another selector for normal events - not average or total)
                } else if (variables.checkboxValues.includes("date")) {
                    // total events vs date
                    const getData = this.handleApiCall('events', 'daily')
                    getData.then(res => res.json())
                        .then((data) => {
                            // if the data coming back does not include a status code (the user has not exceded the rate limit)
                            if (!data.code) {
                                // console.log(data);

                                const graphData = {
                                    graphType: "column",
                                    graphTitle: "Total Events vs. Date",
                                    axisXTitle: "Date",
                                    axisYTitle: "Total Events",
                                    showInLegend: false,
                                    legendText: "",
                                    data: data
                                }

                                // put the data in the right format for the graph
                                graphData.data = data.map((item) => {
                                    return { label: item.date.slice(0, 10), y: parseInt(item.events) }
                                })
                                // console.log(graphData);
                                // this.props.getVariables(graphData)

                                // graph analysis
                                const analysis = "From this graph you can see the total number of ads being seen by customers/users each day (Assumption: An 'event' refers to a customer seeing an ad)."
                                const graphDataPlusAnalysis = [graphData, analysis]
                                // send the graph data up to App.js
                                this.props.getVariables(graphDataPlusAnalysis)

                            } else {
                                // let the user know they have exceded the rate limit, and to wait up to 30sec before making another one (tokens are replenished after 30 sec)
                               
                                alert(data.message)
                            }
                        }).catch((error) => {
                            console.log(error);
                            // Api endpoint rate-limiting alert
                            // if (res.status === 429)
                        })
                } else if (variables.checkboxValues.includes("hour")) {
                    // avg events vs hour
                    // this.handleApiCall('events', 'hourly')

                    const getData = this.handleApiCall('events', 'hourly')
                    getData.then(res => res.json())
                        .then((data) => {
                            // if the data coming back does not include a status code (the user has not exceded the rate limit)
                            if (!data.code) {
                                // console.log(data);
                                let countObj = {}
                                // need the total events for each hour & the number of hour samples, store in countObj 
                                data.forEach((item) => {
                                    let hour = item.hour
                                    if (!countObj[`${hour}`]) {
                                        countObj[`${hour}`] = {
                                            totalEvents: item.events,
                                            numberOfEvents: 1
                                        }
                                    } else {
                                        countObj[`${hour}`].totalEvents = countObj[`${hour}`].totalEvents + item.events
                                        countObj[`${hour}`].numberOfEvents++
                                    }
                                })
                                // get the average events for each hour
                                for (let item in countObj) {
                                    // console.log(countObj[`${item}`]);
                                    countObj[`${item}`]['averageEvents'] = parseInt(countObj[`${item}`].totalEvents / countObj[`${item}`].numberOfEvents)
                                }
                                // console.log(countObj);
                                // format the data to send to App.js
                                const graphData = {
                                    graphType: "column",
                                    graphTitle: "Average Events vs. Hour",
                                    axisXTitle: "Hour (24hr clock)",
                                    axisYTitle: "Average Events",
                                    showInLegend: false,
                                    legendText: "",
                                    data: []
                                }
                                // console.log(graphData);
                                // put the data in the right format for the graph
                                const countArray = Object.entries(countObj)
                                // console.log(countArray);

                                graphData.data = countArray.map((item) => {
                                    return { label: item[0], y: item[1].averageEvents }
                                })
                                // console.log(graphData);
                                // graph analysis
                                const analysis = "For each bar, on average this many ads are being seen by users at that point in the day (Assumption: An 'event' refers to a customer seeing an ad)."
                                const graphDataPlusAnalysis = [graphData, analysis]
                                // send the graph data up to App.js
                                this.props.getVariables(graphDataPlusAnalysis)
                            } else {
                                // let the user know they have exceded the rate limit, and to wait up to 30sec before making another one (tokens are replenished after 30 sec)
                                alert(data.message)
                            }
                        }).catch((error) => {
                            // console.log(error);
                        })

                }
            }
        } else {
            this.props.getVariables(variables)
            // else if the user did not choose "events" as one of the variables, go into the Stats Graphs option:

            // 2. Stats Graphs (impressions, clicks, revenue)
            if (variables.checkboxValues.includes("impressions")) {

                if (variables.checkboxValues.includes("clicks")) {
                    // impressions vs clicks
                    this.handleApiCall('stats', 'hourly')
                } else if (variables.checkboxValues.includes("revenue")) {
                    // revenue vs impressions
                    this.handleApiCall('stats', 'hourly')
                } else {
                    // impressions
                    if (variables.selector.average) {
                        if (variables.checkboxValues.includes("date")) {
                            // avg impressions vs day
                            // this.handleApiCall('stats', 'hourly')
                            // total impressions vs day / 24 (num of days)
                            this.handleApiCall('stats', 'daily')
                        } else {
                            // avg impressions vs hour
                            this.handleApiCall('stats', 'hourly')
                        }
                    } else if (variables.selector.total) {
                        // total impressions vs day
                        this.handleApiCall('stats', 'daily')
                    } else {
                        // impressions vs day, for each hour
                        this.handleApiCall('stats', 'hourly')
                    }
                }

            } else if (variables.checkboxValues.includes("clicks")) {

                if (variables.selector.average) {
                    if (variables.checkboxValues.includes("date")) {
                        // avg clicks vs day
                        // this.handleApiCall('stats', 'hourly')
                        // total clicks vs day / 24 (num of days)
                        this.handleApiCall('stats', 'daily')
                    } else {
                        // avg clicks vs hour
                        this.handleApiCall('stats', 'hourly')
                    }
                } else if (variables.selector.total) {
                    // total clicks vs day
                    this.handleApiCall('stats', 'daily')
                } else {
                    // clicks vs day, for each hour
                    this.handleApiCall('stats', 'hourly')
                }

            } else if (variables.checkboxValues.includes("revenue")) {

                if (variables.checkboxValues.includes("clicks")) {
                    // revenue vs clicks
                    this.handleApiCall('stats', 'hourly')
                } else {
                    // revenue
                    if (variables.selector.average) {
                        if (variables.checkboxValues.includes("date")) {
                            // avg revenue vs day
                            // this.handleApiCall('stats', 'hourly')
                            // total revenue vs day / 24 (num of days)
                            this.handleApiCall('stats', 'daily')
                        } else {
                            // avg revenue vs hour
                            this.handleApiCall('stats', 'hourly')
                        }
                    } else if (variables.selector.total) {
                        // total revenue vs day
                        this.handleApiCall('stats', 'daily')

                    } else {
                        // revenue vs day, for each hour
                        this.handleApiCall('stats', 'hourly')
                    }
                }

            }
        }
    }

    handleApiCall = (var1, var2, var3) => {
        // let data;
        if (var3) {
            // console.log(`I am 3 variables`);
            // i.e. /events/daily & /impressions/daily (both share var3)

            // const dataOne = fetch(`/${var1}/${var2}`, {
            // })
            // .then(res => res.json())
            // .then((data) => {
            //     console.log(data);
            // })

            // const dataTwo = fetch(`/${var3}/${var2}`, {
            // })
            // .then(res => res.json())
            // .then((data) => {
            //     console.log(data);
            // })

            return Promise.all([
                fetch(`/${var1}/${var2}`),
                fetch(`/${var3}/${var2}`)
            ])
            // .then(res => res.json())
            // .then((data) => {
            //     console.log(data);
            // })

        } else {
            // console.log(`I am 2 variables`);

            // const data = fetch(`/${var1}/${var2}`, {
            // })
            // .then(res => res.json())
            // .then((data) => {
            //     console.log(data);
            // })

            return fetch(`/${var1}/${var2}`)

        }
    }

    handleChange = (event) => {
        // if the selector checkbox value has the word Average in it

        if (event.target.className === "selectorRadio") {
            // if a selector radio input was clicked
            // check to see if any normal, avgerage or total value has been saved in state, if so, automatically click that one
            if (this.state.selector.average || this.state.selector.total || this.state.selector.normal) {
                // if either average or total was previously picked, automatically select that radio button for the current checkbox
                // if either average or total was not previously picked, save the current choice in state
                let re = /Average/
                let re2 = /Total/
                if (re.test(event.target.value)) {
                    // if the current selection value contains Avgerage
                    this.setState({
                        selector: {
                            normal: false,
                            average: true,
                            total: false
                        }
                    })
                } else if (re2.test(event.target.value)) {
                    // if the current selection value contains Total
                    this.setState({
                        selector: {
                            normal: false,
                            average: false,
                            total: true
                        }
                    })
                } else {
                    // if the current selection value contains Normal
                    this.setState({
                        selector: {
                            normal: true,
                            average: false,
                            total: false
                        }
                    })
                }
            } else {
                // if either normal, average or total was not previously picked, save the current choice in state
                let re = /Average/
                let re2 = /Total/
                if (re.test(event.target.value)) {
                    // if the current selection value contains Avgerage
                    this.setState({
                        selector: {
                            normal: false,
                            average: true,
                            total: false
                        }
                    })
                } else if (re2.test(event.target.value)) {
                    // if the current selection value contains Total
                    this.setState({
                        selector: {
                            normal: false,
                            average: false,
                            total: true
                        }
                    })
                } else {
                    // if the current selection contains Normal
                    this.setState({
                        selector: {
                            normal: true,
                            average: false,
                            total: false
                        }
                    })
                }
            }
        } else {
            // else if a checkbox input was clicked
            // grab the checkbox that was checked
            // going to use the boolean to open/close the extra selectors for the variables (total and average) 
            const checkbox = event.target.value;
            const selected = { ...this.state.checkboxesSelected }
            if (!selected[`${checkbox}`]) {
                // the array does not contain this checkbox OR the array contains it and it is FALSE (both will open the extra selectors)
                selected[`${checkbox}`] = true
            } else {
                // the array does contain this checkbox and it was TRUE, so make it FALSE to hide the selectors
                selected[`${checkbox}`] = false
            }
            this.setState({
                checkboxesSelected: selected
            })
        }
    }

    componentDidUpdate() {
        // when one average/total selector is clicked for a checkbox, all the corresponding average/total selectors for the other checkboxes will be automatically clicked when they appear (ensures that only average & average and total & total variables will be graphically compared)
        // check if average or total is true in state (if yes, then there was a radio button already selected)
        if (this.state.selector.average || this.state.selector.total) {
            // check to see if it was average or total
            if (this.state.selector.average) {
                // average was selected
                // ****need to move this part into when the checkbox is ticked
                // grab all the radio inputs with value ___Average and fill them
                // first grab all of the radio inputs curretnly rendered
                const allRadioInputs = [...document.getElementsByClassName("selectorRadio")]
                let re = /Average/
                // filter the inputs to just grab the ones with value ___Average
                const averageRadioInputs = allRadioInputs.filter((input) => {
                    return re.test(input.value)
                })
                // console.log(averageRadioInputs);
                // fill all the inputs withe the value ___Average
                averageRadioInputs.forEach((input) => {
                    input.checked = true
                })
            } else {
                // total was selected
                // first grab all of the radio inputs curretnly rendered
                const allRadioInputs = [...document.getElementsByClassName("selectorRadio")]
                let re = /Total/
                // filter the inputs to just grab the ones with value ___Average
                const totalRadioInputs = allRadioInputs.filter((input) => {
                    return re.test(input.value)
                })
                // console.log(totalRadioInputs);
                // fill all the inputs withe the value ___Average
                totalRadioInputs.forEach((input) => {
                    input.checked = true
                })
            }
        } else {
            // neither average or total was selected, do not need to do anything with the radio buttons
        }
    }

    render() {
        return (
            <div className="selectorContainer">

                {this.state.poiSelected
                    /* if the user has selected a poi to see data for, render the variable options for the graph */
                    ?
                    <form onSubmit={this.handleSubmit} className="selectVariablesForm">
                        <h2>Select variables to compare</h2>

                        <div className="variablesContainer">
                            <div className="checkboxContainer">
                                <label htmlFor="date">Date</label>
                                <input type="checkbox" id="date" value="date" className="checkbox"></input>
                            </div>

                            <div className="checkboxContainer">
                                <label htmlFor="hour">Hour</label>
                                <input type="checkbox" id="hour" value="hour" className="checkbox"></input>
                            </div>

                            {this.state.checkboxesSelected.events
                                ?
                                // render the Events checkbox + the sub-choices (average and total)
                                <div className="checkboxContainer">
                                    <label htmlFor="events">Events</label>
                                    <input type="checkbox" id="events" value="events" className="checkbox" onChange={this.handleChange}></input>

                                    <div className="extraVariableSelectors">
                                        <div className="extraVariable">
                                            <label htmlFor="average">Normal</label>
                                            <input type="radio" id="normal" value="eventsNormal" className="selectorRadio" name="avgOrTotalOne" onChange={this.handleChange}></input>
                                        </div>

                                        <div className="extraVariable">
                                            <label htmlFor="average">Average</label>
                                            <input type="radio" id="average" value="eventsAverage" className="selectorRadio" name="avgOrTotalOne" onChange={this.handleChange}></input>
                                        </div>

                                        <div className="extraVariable">
                                            <label htmlFor="total">Total</label>
                                            <input type="radio" id="total" value="eventsTotal" className="selectorRadio" name="avgOrTotalOne" onChange={this.handleChange}></input>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="checkboxContainer">
                                    <label htmlFor="events">Events</label>
                                    <input type="checkbox" id="events" value="events" className="checkbox" onChange={this.handleChange}></input>
                                </div>
                            }

                            {this.state.checkboxesSelected.impressions
                                ?
                                <div className="checkboxContainer">
                                    <label htmlFor="impression">Impressions</label>
                                    <input type="checkbox" id="impressions" value="impressions" className="checkbox" onChange={this.handleChange}></input>

                                    <div className="extraVariableSelectors">
                                        <div className="extraVariable">
                                            <label htmlFor="average">Average</label>
                                            <input type="radio" id="average" value="impressionsAverage" className="selectorRadio" name="avgOrTotalTwo" onChange={this.handleChange}></input>
                                        </div>

                                        <div className="extraVariable">
                                            <label htmlFor="total">Total</label>
                                            <input type="radio" id="total" value="impressionsTotal" className="selectorRadio" name="avgOrTotalTwo" onChange={this.handleChange}></input>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="checkboxContainer">
                                    <label htmlFor="impression">Impressions</label>
                                    <input type="checkbox" id="impressions" value="impressions" className="checkbox" onChange={this.handleChange}></input>
                                </div>
                            }

                            {this.state.checkboxesSelected.clicks
                                ?
                                <div className="checkboxContainer">
                                    <label htmlFor="clicks">Clicks</label>
                                    <input type="checkbox" id="clicks" value="clicks" className="checkbox" onChange={this.handleChange}></input>

                                    <div className="extraVariableSelectors">
                                        <div className="extraVariable">
                                            <label htmlFor="average">Average</label>
                                            <input type="radio" id="average" value="clicksAverage" className="selectorRadio" name="avgOrTotalThree" onChange={this.handleChange}></input>
                                        </div>

                                        <div className="extraVariable">
                                            <label htmlFor="total">Total</label>
                                            <input type="radio" id="total" value="clicksTotal" className="selectorRadio" name="avgOrTotalThree" onChange={this.handleChange}></input>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="checkboxContainer">
                                    <label htmlFor="clicks">Clicks</label>
                                    <input type="checkbox" id="clicks" value="clicks" className="checkbox" onChange={this.handleChange}></input>
                                </div>
                            }

                            {this.state.checkboxesSelected.revenue
                                ?
                                <div className="checkboxContainer">
                                    <label htmlFor="revenue">Revenue</label>
                                    <input type="checkbox" id="revenue" value="revenue" className="checkbox" onChange={this.handleChange}></input>

                                    <div className="extraVariableSelectors">
                                        <div className="extraVariable">
                                            <label htmlFor="average">Average</label>
                                            <input type="radio" id="average" value="revenueAverage" className="selectorRadio" name="avgOrTotalFour" onChange={this.handleChange}></input>
                                        </div>

                                        <div className="extraVariable">
                                            <label htmlFor="total">Total</label>
                                            <input type="radio" id="total" value="revenueTotal" className="selectorRadio" name="avgOrTotalFour" onChange={this.handleChange}></input>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="checkboxContainer">
                                    <label htmlFor="revenue">Revenue</label>
                                    <input type="checkbox" id="revenue" value="revenue" className="checkbox" onChange={this.handleChange}></input>
                                </div>
                            }
                        </div>

                        <button>Create Graph</button>
                    </form>
                    :
                    // if the user has not selected a poi, show the poi slector input
                    <form className="selectPOIForm">
                        <h2>Select a POI</h2>
                        <label htmlFor=""></label>
                        <select className="selectPOI" onChange={this.handlePoiChange}>
                            <option>POI</option>
                            <option value="eqworks">EQ Works</option>
                            <option value="cntower">CN Tower</option>
                            <option value="niagarafalls">Niagara Falls</option>
                            <option value="vancouverharbour">Vancouver Harbour</option>
                        </select>
                    </form>
                }
            </div>
        )
    }
}

export default SelectData;