import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const { userRole, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}