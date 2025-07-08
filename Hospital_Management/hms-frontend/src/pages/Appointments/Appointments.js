import { Box, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";


export default function Appointments(){
    const {token} = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/Appointment", {
            headers: { Authorization:`Bearer ${token}`}
        })
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Error fetching appointments:", err));
    }, [token]);

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
                            </TableCell><TableCell>
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            appointments.map((appt) => (
                                <TableRow>
                                    <TableCell>{appt.patientName}</TableCell>
                                    <TableCell>{appt.doctorName}</TableCell>
                                    <TableCell>{new Date(appt.dateTime).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(appt.dateTime).toLocaleTimeString()}</TableCell>
                                    <TableCell>{appt.status}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>
        </Container>
    )
}