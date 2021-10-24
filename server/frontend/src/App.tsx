import React from "react";
import "./App.css";
import UserContext from "./User";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

const user = {
  name: "nice",
  currentPage: "home",
  darkMode: false,
  defaultValue: "",
};

function App() {
  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <Router>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/">
              <Landing />
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
