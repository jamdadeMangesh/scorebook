import React from 'react';
import './App.scss';
import { Route, BrowserRouter as Router , Routes } from 'react-router-dom';
import { Home } from './Views/Home/Home';
import Dashboard from './Views/Dashboard/Dashboard';

function App() {
    return (
        <div className="App">
            {/* <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button> */}
             <Router>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/dashboard' element={<Dashboard />}></Route>
                    {/*<Route path='/edit' element={<Edit />}></Route> */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
