import { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { getMyTransactions } from "../services/transactionService";
import { formatDuration } from "../utils/time";
import { UserContext } from "../contexts/UserContext";
import { Link as RouterLink } from "react-router-dom";

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getMyTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error al obtener transacciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5">No tienes transacciones todavía.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3, fontWeight: "bold" }}>
        Mis Transacciones
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Título</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Duración</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Usuario</strong></TableCell>
              <TableCell><strong>Oferta</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => {
              const isSender = tx.sender.id === currentUser?.id;
              const otherUser = isSender ? tx.receiver : tx.sender;

              return (
                <TableRow key={tx.id}>
                  <TableCell>{tx.title || "Sin título"}</TableCell>
                  <TableCell>{tx.text || "-"}</TableCell>
                  <TableCell
                    sx={{
                      color: isSender ? "red" : "green",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {isSender ? (
                      <>
                        <ArrowUpward fontSize="small" />
                        -{formatDuration(tx.duration)}
                      </>
                    ) : (
                      <>
                        <ArrowDownward fontSize="small" />
                        +{formatDuration(tx.duration)}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(tx.datetime).toLocaleString("es-ES", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/users/${otherUser.id}`}
                      underline="hover"
                    >
                      {otherUser.first_name} {otherUser.last_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {tx.offer ? (
                      <Link
                        component={RouterLink}
                        to={`/offers/${tx.offer.id}`}
                        underline="hover"
                      >
                        {tx.offer.title}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
