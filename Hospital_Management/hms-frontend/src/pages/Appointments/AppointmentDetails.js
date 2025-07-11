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

    useEffect(() => {
        api.get(`/Appointment/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setAppointment(res.data))
        .catch(err => console.error("Failed to fetch appointment:", err));
    }, [id, token]);

    if (!appointment) return <Typography>Loading...</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4">Appointment Details</Typography>
            <Box sx={{ mt: 2 }}>
                <Typography><strong>Patient ID:</strong> {appointment.patientId}</Typography>
                <Typography><strong>Doctor ID:</strong> {appointment.doctorId}</Typography>
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
