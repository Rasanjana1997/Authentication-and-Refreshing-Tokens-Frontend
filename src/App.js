import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <AuthProvider>

          <Header />

          <PrivateRoute element={<HomePage/>} path='/home' exact />

          <Routes>
            <Route element={<LoginPage />} path='/' />
          </Routes>

        </AuthProvider>

      </BrowserRouter>
    </div>
  );
}

export default App;
