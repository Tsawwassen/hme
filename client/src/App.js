
import './App.css';

//Modules
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//React-Bootstrap
import Container from 'react-bootstrap/Container';

//Components
import Navigation from './component/Navigation.js';
import Home from './component/Home.js';
import Inventory from './component/Inventory.js';
import StaleOrder from './component/StaleOrder.js';
import Labels from './component/Labels.js';
import Commission from './component/Commission.js';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Container>
        <BrowserRouter>
          <Routes>
              <Route path="home" element={<Home />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="staleOrder" element={<StaleOrder />} />
              <Route path="labels" element={<Labels />} />
              <Route path="commission" element={<Commission />} />
          </Routes>
      </BrowserRouter>
    </Container>
    </div>
  );
}

export default App;
