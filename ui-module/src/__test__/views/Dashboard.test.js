import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from '../../views/Dashboard';

it("Dashboard view render correctly", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Dashboard></Dashboard>, div);
})
 
