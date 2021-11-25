import React, { useEffect } from "react";
import axios from "axios";
import "./App.css";
import UserContext from "./User";
import getcookie from "./getcookie";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const user = {
  currentPage: "home",
  defaultValue: "",
};

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (getcookie("token", true) !== "Loading..." && getcookie("token", true) !== "") {
        axios.defaults.headers.common["authorization"] =
          "bearer " + getcookie("token", true);
      } else {
        try {
          delete axios.defaults.headers.common["authorization"];
        } catch (e) {
          console.log("TOKEN DOES NOT EXIST");
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <Router>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
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
