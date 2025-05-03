import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterGallery from './components/CharacterGallery';
import CharacterDetail from './components/CharacterDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterGallery />} />
        <Route path="/character/:id" element={<CharacterDetail />} />
      </Routes>
    </Router>
  );
}

export default App;