import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AddAppointment from './pages/Appointments/AddAppointment';
import Appointments from './pages/Appointments/Appointments';
import DeleteAppointment from './pages/Appointments/DeleteAppointment';
import EditAppointment from './pages/Appointments/EditAppointment';
import AddDoctor from './pages/Doctor/AddDoctor';
import Doctor from './pages/Doctor/Doctor';
import DoctorDetails from './pages/Doctor/DoctorDetails';
import Editdoctor from './pages/Doctor/EditDoctor';
import Home from './pages/Home';
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
        <Route path='/home' element={<Home/>}/>
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
          <Route path='/doctors' element={<PrivateRoute><Doctor/></PrivateRoute>}/>
          <Route path='/doctor/add' element={<PrivateRoute>
            <AddDoctor/>
          </PrivateRoute>}/>
          <Route path='/doctor/:id' element={<PrivateRoute><DoctorDetails/></PrivateRoute>}></Route>
          <Route path='/edit-doctor/:id' element = {
            <PrivateRoute><Editdoctor/></PrivateRoute>
          }></Route>
          <Route path='/appointments' element={<PrivateRoute><Appointments/></PrivateRoute>}></Route>
          <Route path='/appointments/add' element={<PrivateRoute><AddAppointment/></PrivateRoute>}>
          </Route>
          <Route path='/appointment/edit/:id' element={<PrivateRoute><EditAppointment></EditAppointment></PrivateRoute>}></Route>
          <Route path='/appointment/delete/:id' element={<PrivateRoute><DeleteAppointment></DeleteAppointment></PrivateRoute>}></Route>
          <Route path='*' element={<Navigate to={'/login'}/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
