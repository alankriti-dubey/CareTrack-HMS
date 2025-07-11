import { Box, Button, Container, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function AppointmentDetails() {
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        api.get("/Patient", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setPatients(res.data))
            .catch(err => console.error("Error fetching patients:", err));

        api.get("/Doctor", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setDoctors(res.data))
            .catch(err => console.error("Error fetching doctors:", err));
        api.get(`/Appointment/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setAppointment(res.data))
            .catch(err => console.error("Failed to fetch appointment:", err));
    }, [id, token]);

    const getPatientName = (id) => {
        const patient = patients.find(p => p.id === id);
        return patient?.user?.fullName || "Unknown";
    };

    const getDoctorName = (id) => {
        const doctor = doctors.find(d => d.id === id);
        return doctor?.user?.fullName || "Unknown";
    };

    if (!appointment) return <Typography>Loading...</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4">Appointment Details</Typography>
            <Box sx={{ mt: 2 }}>
                <Typography><strong>Patient:</strong> {getPatientName(appointment.patientId)}</Typography>
                <Typography><strong>Doctor:</strong> {getDoctorName(appointment.doctorId)}</Typography>
                <Typography><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</Typography>
                <Typography><strong>Time:</strong> {new Date(appointment.appointmentDate).toLocaleTimeString()}</Typography>
                <Typography><strong>Status:</strong> {appointment.status}</Typography>
                <Typography><strong>Description:</strong> {appointment.description}</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={() => navigate(`/appointments/edit/${id}`)}>Edit</Button>
            </Box>
        </Container>
    );
}
