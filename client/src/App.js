import React, { Component } from 'react';
import './App.css';
import SelectData from './SelectData';
import DisplayData from './DisplayData';
import Map from './Map'

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        userSelectedVariables: false,
        variables: {}
      },
      mapButtonClicked: false,
      poi: {}
    }
  }

  handleVariables = (variables) => {
    this.setState({
      data: {
        userSelectedVariables: true,
        variables: variables
      }
    })
  }

  handleCreateNewGraph = () => {
    this.setState({
      data: {
        userSelectedVariables: false,
        variables: {}
      }
    })
  }

  handleMapButtonClick = () => {
    this.setState({
      data: {
        userSelectedVariables: true
      },
      mapButtonClicked: true
    })
  }

  handlePoiChoice = (poiData) => {
    this.setState({
      poi: poiData[0]
    })
  }

  handleNewPoi = () => {
    this.setState({
      data: {
        userSelectedVariables: false
      },
      mapButtonClicked: false
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.data.userSelectedVariables
        ?
          <header className="graphHeader">
            <div className="wrapper flexContainer">
              <h1>Data Visualization</h1>
            </div>
          </header>
        :
          <header className="selectHeader">
            <div className="wrapper flexContainer">
              <h1>Data Visualization</h1>
            </div>
          </header>
        }
        <main>
            {this.state.data.userSelectedVariables
              ?
              <div className="graphMain">
                <div className="wrapper flexContainer">
                  {this.state.mapButtonClicked
                  ?
                  // <div id='map' style='width: 400px; height: 300px;'></div> 
                  <div className="mapContainer">
                    <Map
                    passPOI={this.state.poi} />
                    <button 
                    className="mapButton"
                    onClick={this.handleNewPoi}>New POI</button>
                  </div>
                  :
                  <DisplayData
                  passVariables={this.state.data.variables}
                  createNewGraph={this.handleCreateNewGraph} />
                  }
                </div>
              </div>
              :
              <div className="selectPoiContainer">
                <div className="wrapper">
                  <SelectData
                    getVariables={this.handleVariables}
                    mapButtonClick={this.handleMapButtonClick}
                    passPOI={this.handlePoiChoice} />
                </div>
              </div>
            }
        </main>
        {this.state.data.userSelectedVariables
        ?
          <footer className="graphFooter">
            <div className="wrapper flexContainer">
              <p>Built by Sarah Armitage</p>
            </div>
          </footer>
        :
          <footer className="selectFooter">
            <div className="wrapper flexContainer">
              <p>Built by Sarah Armitage</p>
            </div>
          </footer>
        }
      </div>
    );
  }
}

export default App;

