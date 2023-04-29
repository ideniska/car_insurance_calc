import "./App.css";
import FirstPage from "./pages/first/firstpage";
import SecondPage from "./pages/second/secondpage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Switch, Route, Link, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={FirstPage}></Route>
        <Route path="/2" Component={SecondPage}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
