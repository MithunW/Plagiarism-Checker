import React from 'react';
import ReactDOM from 'react-dom';
import History from '../../views/History';

it("History view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<History></History>, div);
})
 