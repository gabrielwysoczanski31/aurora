import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './MainApp';
import './aunoma-styles.css'; // Fixed import path (removed redundant 'src/')

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;