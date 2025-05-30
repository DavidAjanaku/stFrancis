// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './navigation/header'
import Home from './pages/home'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import MassTimes from './pages/MassTimes'
// import Ministries from './pages/Ministries'
// import Events from './pages/Events'
// import Gallery from './pages/Gallery'
// import Prayers from './pages/Prayers'
// import Donate from './pages/Donate'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mass-times" element={<MassTimes />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/prayers" element={<Prayers />} />
          <Route path="/donate" element={<Donate />} /> */}
        </Routes>
      </div>
    </Router>
  )
}

export default App