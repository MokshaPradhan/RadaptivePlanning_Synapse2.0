import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GoogleMapsComponent from './GoogleMapsComponent';
import WeatherPage from './WeatherPage'; // This will be your weather data component

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={GoogleMapsComponent} />
        <Route path="/weather" component={WeatherPage} />
      </Switch>
    </Router>
  );
}

export default App;
