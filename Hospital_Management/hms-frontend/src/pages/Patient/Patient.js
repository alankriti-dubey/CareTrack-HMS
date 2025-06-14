import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const { userRole, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const handleDelete = (id) => {
        if(!window.confirm("Are you sure you want to delete data")) return;

        api.delete(`/Patient/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setPatients(prev => prev.filter(
                p => p.id !==id
            ));
        })
        .catch(err => {
                console.error("Failed to delete patient: ", err);
                alert("Failed to delete patient. Please try again.")
            })
    }

    useEffect(() => {
        if (userRole != "admin") {
            alert("Access Denied - Admins only");
            navigate("/");
            return;
        }
        else {
            api.get("/Patient", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => setPatients(res.data))
                .catch((err) => {
                    if (err.response?.status === 401) {
                        logout();
                        navigate("/login");
                    }
                });
        }
    }, [userRole, logout, navigate]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Patients</Typography>
            <Button variant="contained" onClick={() => navigate("/patients/new")}> Add Patients</Button>
            <Table sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>DOB</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>View Details</TableCell>
                        <TableCell>Delete Patient</TableCell>
                        <TableCell>Edit Patient Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patients.map(p => (
                        <TableRow key={p.id}>
                            <TableCell>{p.fullName}</TableCell>
                            <TableCell>{p.gender}</TableCell>
                            <TableCell>{new Date(p.dob).toLocaleDateString()}</TableCell>
                            <TableCell>{p.phone}</TableCell>
                            <TableCell>{p.address}</TableCell>
                            <TableCell><Button variant="outlined" onClick={() => navigate(`/patients/${p.id}`)}> View</Button></TableCell>
                            <TableCell>
                                <Button color="error" variant="outlined" onClick={() => handleDelete(p.id)}>Delete</Button>
                            </TableCell>
                            <TableCell><Button  variant="outlined" onClick={() => navigate(`/edit-patient/${p.id}`)}>Edit</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}