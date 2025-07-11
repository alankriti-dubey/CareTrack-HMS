import { Box, Button, Container, MenuItem, TextField, Typography } from "@mui/material";
import {
    useContext, useEffect, useState
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function AddAppointment(){
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState({
        patientId: "",
        doctorId: "",
        appointmentDate:"",
        description :"",
        status: "Scheduled"
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState("");
    useEffect(() => {

        api.get("/Patient",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setPatients(res.data))
        .catch(() => setError("Failed to load patients"));

        api.get("/Doctor",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(res => setDoctors(res.data))
        .catch(err => console.error("Failed to get doctors: ", err))
    }, [token]);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setAppointment(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post("/Appointment", appointment, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(() => navigate("/appointments"))
        .catch( err => setError(err.response?.data || "Failed to book appointment"));
    };

    return(
        <Container sx={{mt: 4}}>
        <Typography variant="h4">
            Add Appointment
        </Typography>
        {error && <Typography color="error">{typeof error === "string" ? error : error.title}</Typography>}
            <Box component="form" onSubmit={handleSubmit} sx={{mt: 3, display: "flex", flexDirection:"column", gap:2}}>
            <TextField
            select
            label = "Patient"
            name="patientId"
            value={appointment.patientId}
            onChange={handleChange}
            required
            >
            {
                patients.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                        {p.user.fullName}
                    </MenuItem>
                ))
            }

            </TextField>
            <TextField
            select
            label = "Doctor"
            name="doctorId"
            value={appointment.doctorId}
            onChange={handleChange}
            required
            >
            {
                doctors.map(p => (
                    <MenuItem key={p.id} value={p.id}>

                        {p.user.fullName}
                    </MenuItem>
                ))
            }

            </TextField>

            <TextField type="datetime-local" name="appointmentDate" value={appointment.appointmentDate} onChange={handleChange} required InputLabelProps={{shrink: true}}></TextField>
            <TextField type="Description" name="description" value={appointment.description} onChange={handleChange} multiline rows={3}></TextField>
            <TextField
  select
  label="Status"
  name="status"
  value={appointment.status}
  onChange={handleChange}
>
  <MenuItem value="Scheduled">Scheduled</MenuItem>
  <MenuItem value="Completed">Completed</MenuItem>
  <MenuItem value="Cancelled">Cancelled</MenuItem>
</TextField>

            <Button type="submit" variant="contained">Create Appointment</Button>
            </Box>
        </Container>
    )
}