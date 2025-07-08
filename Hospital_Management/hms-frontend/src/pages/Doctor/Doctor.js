import { Box, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";


export default function Doctor(){
    const [doctors, setDoctors]= useState([]);
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/Doctor",{
            headers:{Authorization:`Bearer ${token}`}
        })
        .then(res => setDoctors(res.data))
        .catch(err => console.err("Failed to fetch doctors: ", err));
    }, [token]);


    const handleDelete =(id) => {
        if(window.confirm("Are you sure you want to delete this doctor?")){
            api.delete(`/Doctor/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(() => setDoctors(prev => prev.filter(d => d.id != id)))
            .catch(err => alert("Delete Failed."))
        }
    }
    return (
        <Container sx={{mt:4}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb = {2}>
                <Typography variant="h4">
                    Doctors
                </Typography>
                <Button variant="contained" onClick={() => navigate("/doctor/add")}>
                    Add Doctor
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Specialization</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Actiions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        doctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell>{doctor.user.fullName}</TableCell>
                                <TableCell>{doctor.gender}</TableCell>
                                <TableCell>{doctor.specialization}</TableCell>
                                <TableCell>{doctor.user?.email}</TableCell>
                                <TableCell>{doctor.phone}</TableCell>
                                <TableCell>
                                    <Button onClick={() => navigate(`/doctor/${doctor.id}`)}>
                                        View
                                    </Button>
                                    <Button onClick={() => navigate(`/edit-doctor/${doctor.id}`)}>
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(doctor.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Container>
    )
}  