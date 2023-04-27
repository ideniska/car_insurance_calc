import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


export default function Navbar() {
    return (
        <div className="navbar">
            <h4 id='nav--brand'>PolicyMe</h4>
            <h4 id='nav--phone'>Questions? +1 (866) 999-7457</h4>
        </div>
    )
}