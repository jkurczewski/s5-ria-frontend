import './App.css';
import React from 'react';
import Navigation from './components/navigation';
import Footer from './components/footer';
import Pages from './pages';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Pages />
      <Footer />
    </div>
  );
}

export default App;
