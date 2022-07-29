import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import UserSignUp from "./components/UserSignUp";
import Header from "./components/Header";
import UserSignOut from "./components/UserSignOut";
import UserSignIn from "./components/UserSignIn";
import CarerList from "./components/CarerList";
import CarerDetail from "./components/CarerDetail";
import DatePicker from "./components/DatePicker";
import CreateCarer from "./components/CreateCarer";
import Landing from "./components/Landing";
import ClientList from "./components/ClientList";
import Evaluate from "./components/Evaluate";
import PrintMonthly from "./components/Graphs/PrintMonthly";
import PrintAnnual from "./components/Graphs/PrintAnnual";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/carers/1/date" element={<DatePicker />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/signout" element={<UserSignOut />} />
          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/carers" element={<CarerList />} />
          <Route path="/carers/:id" element={<CarerDetail />} />
          <Route path="/carers/create" element={<CreateCarer />} />
          <Route path="/" element={<Landing />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/evaluate/:id" element={<Evaluate />} />
          <Route path="/annualmetrics" element={<PrintAnnual />} />
          <Route path="/carers/1/monthlymetric" element={<PrintMonthly />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
