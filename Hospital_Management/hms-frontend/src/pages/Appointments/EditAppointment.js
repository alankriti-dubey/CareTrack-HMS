import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function EditAppointment() {
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState({
        appointmentDate: "",
        status: "",
        patientId: "",
        doctorId: "",
        description: ""
    });

    useEffect(() => {
        api.get(`/Appointment/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setAppointment(res.data);
        })
        .catch(() => alert("Failed to load appointment"));
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.put(`/Appointment/${id}`, appointment, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Updated!");
            navigate("/appointments");
        })
        .catch(() => alert("Failed to update"));
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4">Edit Appointment</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField type="datetime-local" name="appointmentDate" value={appointment.appointmentDate} onChange={handleChange} required />
                <TextField label="Status" name="status" value={appointment.status} onChange={handleChange} required />
                <TextField label="Patient ID" name="patientId" value={appointment.patientId} onChange={handleChange} required />
                <TextField label="Doctor ID" name="doctorId" value={appointment.doctorId} onChange={handleChange} required />
                <TextField label="Description" name="description" value={appointment.description} onChange={handleChange} multiline />
                <Button type="submit" variant="contained">Update</Button>
            </Box>
        </Container>
    );
}
