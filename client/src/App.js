import React, { useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import UserSignUp from "./components/UserSignUp";
import Header from "./components/Header";
import UserSignOut from "./components/UserSignOut";
import UserSignIn from "./components/UserSignIn";
import CarerList from "./components/CarerList";
import CarerDetail from "./components/CarerDetail";
import DatePicker from "./components/DatePicker";
import Landing from "./components/Landing";
import ClientList from "./components/ClientList";
import Evaluate from "./components/Evaluate";
import PrintCarer from "./components/Graphs/PrintCarer";
import PrintDaily from "./components/Graphs/PrintDaily";
import NewCarerNPC from "./components/NewCarerNPC";
import PrivateRoute from "./components/PrivateRoute";
import Carer from "./components/Carer";
import Forbidden from "./components/Forbidden";
import NotFound from "./components/Notfound";
import Error from "./components/UnhandledError";
import { Evaluated } from "./components/Evaluated";
import UpdateEvaluate from "./components/UpdateEvaluate";
import MonthlyPrint from "./components/Graphs/MonthlyPrint";
function App() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/carers/:id/assessed/select" element={<Carer />} />
          <Route path="/carers/:id/date" element={<PrivateRoute />}>
            <Route index element={<DatePicker />} />
          </Route>
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/signout" element={<UserSignOut />} />
          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/carers" element={<CarerList />} />
          <Route path="/carers/:id/appointment" element={<PrivateRoute />}>
            <Route index element={<CarerDetail />} />
          </Route>
          <Route path="/" element={<Landing />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/carers/:id/assess" element={<PrivateRoute />}>
            <Route index element={<Evaluate />} />
          </Route>
          <Route path="/dailymetrics" element={<PrintDaily />} />
          <Route path="/monthlymetrics" element={<MonthlyPrint />} />
          <Route path="/carers/:id/performance" element={<PrintCarer />} />
          <Route path="/write/:id" element={<PrivateRoute />}>
            <Route index element={<NewCarerNPC />} />
          </Route>

          <Route path="/carers/:id/assessed/update" element={<PrivateRoute />}>
            <Route index element={<UpdateEvaluate />} />
          </Route>
          <Route path="/error" element={<Error />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/carers/:id/assessed/detail"
            element={<Evaluated ref={componentRef} handlePrint={handlePrint} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
