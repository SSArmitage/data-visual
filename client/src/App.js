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
      }
    }
  }

  handleVariables = (variables) => {
    // console.log(variables);

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

  render() {
    return (
      <div className="App wrapper">
        <header>
          <h1>Data Visualized</h1>
        </header>
        <main>

          {this.state.data.userSelectedVariables
            ?
            <DisplayData
              passVariables={this.state.data.variables}
              createNewGraph={this.handleCreateNewGraph} />
            :
            <div className="selectPoiContainer">
              <SelectData
                getVariables={this.handleVariables} />
            </div>
          }
        </main>
        <footer>Built by Sarah Armitage</footer>
      </div>
    );
  }
}

export default App;

