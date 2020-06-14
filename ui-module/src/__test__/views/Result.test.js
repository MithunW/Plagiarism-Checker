import React from 'react';
import ReactDOM from 'react-dom';
import Result from '../../views/Result';

it("Result view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Result></Result>, div);
})
 