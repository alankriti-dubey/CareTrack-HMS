import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AddPatients from './pages/Patient/AddPatients';
import EditPatient from './pages/Patient/EditPatient';
import Patients from './pages/Patient/Patient';
import PatientDetails from './pages/Patient/PatientDetails';
import Register from './pages/Register';

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
          <Route path='/register' element={<Register/>}/>

          <Route path='/patients' element={<PrivateRoute>
            <Patients/>
          </PrivateRoute>}/>
          <Route path='/patients/new' element={<PrivateRoute>
            <AddPatients/>
          </PrivateRoute>}/>
          <Route path='/patients/:id' element={<PrivateRoute><PatientDetails/></PrivateRoute>}></Route>
          <Route path='/edit-patient/:id' element = {
            <PrivateRoute><EditPatient/></PrivateRoute>
          }></Route>
          <Route path='*' element={<Navigate to={'/login'}/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
