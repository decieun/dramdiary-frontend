import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import WhiskyNotes from './pages/WhiskyNotes';
import WhiskyList from './pages/WhiskyList';
import TastingNote from './pages/TastingNote';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WhiskyNotes />} />
            <Route path='/whisky-list' element={<WhiskyList />} />
          <Route path='/add-whisky' element={<TastingNote />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
