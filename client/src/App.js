
import './App.css';
import Home from './component/Home.js';
import Inventory from './component/Inventory.js';
import StaleOrder from './component/StaleOrder.js';
import Labels from './component/Labels.js';

//Modules
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//Components
import Navigation from './component/Navigation.js';

function App() {
  return (
    <div className="App">
      <Navigation />
      <BrowserRouter>
        <Routes>
            <Route path="home" element={<Home />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="staleOrder" element={<StaleOrder />} />
            <Route path="labels" element={<Labels />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
