import React, { Component } from 'react';
import './App.css';
import SelectData from './SelectData';
import DisplayData from './DisplayData';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        userSelectedVariables: false,
        variables: {}
      },
      mapButtonClicked: false
    }
  }

  handleVariables = (variables) => {
    console.log(variables);

    this.setState({
      data: {
        userSelectedVariables: true,
        variables: variables
      }
    })
  }

  handleCreateNewGraph = () => {
    // console.log(`New graph time!`);
    this.setState({
      data: {
        userSelectedVariables: false,
        variables: {}
      }
    })
  }

  handleMapButtonClick = () => {
    console.log("I want a map!");
    this.setState({
      mapButtonClicked: true
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
                <div className="wrapper">
                  <DisplayData
                    passVariables={this.state.data.variables}
                    createNewGraph={this.handleCreateNewGraph} />
                </div>
              </div>
              :
              <div className="selectPoiContainer">
                <div className="wrapper">
                  <SelectData
                    getVariables={this.handleVariables}
                    mapButtonClick={this.handleMapButtonClick} />
                </div>
              </div>
            }
        </main>
        {this.state.data.userSelectedVariables
        ?
          <footer className="graphFooter">
            <div class="wrapper flexContainer">
              <p>Built by Sarah Armitage</p>
            </div>
          </footer>
        :
          <footer className="selectFooter">
            <div class="wrapper flexContainer">
              <p>Built by Sarah Armitage</p>
            </div>
          </footer>
        }
      </div>
    );
  }
}

export default App;

