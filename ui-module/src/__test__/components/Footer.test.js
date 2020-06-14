import React from 'react';
import ReactDOM from 'react-dom';
import Footer from '../../components/Footer/Footer';

it("Footer view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Footer></Footer>, div);
})
 