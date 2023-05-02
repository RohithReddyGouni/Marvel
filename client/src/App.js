import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Characters from "./components/Characters";
import Comics from "./components/Comics";
import Stories from "./components/Stories";
import { Col } from "react-bootstrap";
import Home from "./components/Home";
import CharacterDetails from "./components/CharacterDetails";
import ComicDetails from "./components/ComicDetails";
import StoryDetails from "./components/StoryDetails";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the React.js Marvel website</h1>
          {/* disperse the contents od Row with equal spacing */}
          <Col xs={12} md={12} lg={12}>
            <Link className=" me-4 text-white" to="/characters/page/1">
              <span>Characters</span>
            </Link>
            <Link className=" ms-4 me-4 text-white" to="/comics/page/1">
              <span>Comics</span>
            </Link>
            <Link className=" ms-4 text-white" to="/stories/page/1">
              <span>Stories</span>
            </Link>
          </Col>
        </header>
        <br />
        <br />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters/page/:page/" element={<Characters />} />
            <Route path="/comics/page/:page/" element={<Comics />} />
            <Route path="/stories/page/:page/" element={<Stories />} />
            <Route path="/characters/:id" element={<CharacterDetails />} />
            <Route path="/comics/:id" element={<ComicDetails />} />
            <Route path="/stories/:id" element={<StoryDetails />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
