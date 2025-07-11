import { Box, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";


export default function Appointments(){
    const {token} = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        api.get("/Appointment", {
            headers: { Authorization:`Bearer ${token}`}
        })
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Error fetching appointments:", err));
        api.get("/Patient", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setPatients(res.data))
          .catch(err => console.error("Error fetching patients:", err));

        api.get("/Doctor", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setDoctors(res.data))
          .catch(err => console.error("Error fetching doctors:", err));
 
    }, [token]);


    const getPatientName = (id) => {
        const patient = patients.find(p => p.id === id);
        return patient?.user?.fullName || "Unknown";
    };

    const getDoctorName = (id) => {
        const doctor = doctors.find(d => d.id === id);
        return doctor?.user?.fullName || "Unknown";
    };

    const handleDelete = (id) =>{
        if(window.confirm("Are you sure?")){
            api.delete(`/Apppointment/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(() => setAppointments(prev => prev.filter(a => a.id != id)))
            .catch(err => alert("Failed to delete."))
        }
    }


    return (
        <Container sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Appointments
            </Typography>
            <Button variant="contained" onClick={() => navigate("/appointments/add")}>Add Appointment</Button>
            <Box sx={{mt:3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Patient
                            </TableCell>
                            <TableCell>
                                Doctor
                            </TableCell><TableCell>
                                Date
                            </TableCell><TableCell>
                                Time
                            </TableCell>
                            <TableCell>
                                Description
                            </TableCell><TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            appointments.map((appt) => (
                                <TableRow>
                                    <TableCell>{getPatientName(appt.patientId)}</TableCell>
                                    <TableCell>{getDoctorName(appt.doctorId)}</TableCell>
                                    <TableCell>{new Date(appt.appointmentDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(appt.appointmentDate).toLocaleTimeString()}</TableCell>
                                    <TableCell>{appt.description}</TableCell>
                                    <TableCell>{appt.status}</TableCell>
                                    <TableCell><Button variant="contained" color="error"onClick={() => handleDelete(appt.id)}>Delete</Button>
                                    <Button onClick={() => navigate(`/appointment/edit/${appt.id}`)}>Edit</Button>
                                    <Button variant="outlined" onClick={() => navigate(`/appointment/${appt.id}`)}> View</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>
        </Container>
    )
}