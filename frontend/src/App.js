import "./App.css";
import InsuranceContainer from "./components/InsuranceContainer";
import FirstPage from "./pages/first/FirstStep";
import SecondPage from "./pages/second/SecondStep";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Switch, Route, Link, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={InsuranceContainer}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
