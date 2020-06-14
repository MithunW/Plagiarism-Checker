import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../../components/Navbars/DemoNavbar';

it("Header view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Header></Header>, div);
})
 