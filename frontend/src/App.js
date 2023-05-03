import "./App.css";
import InsuranceContainer from "./components/InsuranceContainer/InsuranceContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
