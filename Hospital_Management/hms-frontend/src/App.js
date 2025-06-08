import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AddPatients from './pages/AddPatients';
import Login from './pages/Login';
import Patients from './pages/Patient';

function PrivateRoute({children}){
  const {token} = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider >
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/patients' element={<PrivateRoute>
            <Patients/>
          </PrivateRoute>}/>
          <Route path='/patients/new' element={<PrivateRoute>
            <AddPatients/>
          </PrivateRoute>}/>
          <Route path='*' element={<Navigate to={'/login'}/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
