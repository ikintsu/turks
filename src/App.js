import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'
import HomePage from './HomePage';
import UserPage from './UserPage/UserPage';
import NewStore from './UserPage/NewStore';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={ <UserPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
