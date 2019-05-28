import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/layout/Header/Header';
import About from './components/pages/About';
import { SearchField } from './components/SearchField';
import './App.css';

class App extends Component {
  state = {
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Header />
            <div className="content">
              <Route
                exact
                path="/"
                render={props => (
                  <React.Fragment>
                    <SearchField />
                  </React.Fragment>
                )}
              />
              <Route path="/about" component={About} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
