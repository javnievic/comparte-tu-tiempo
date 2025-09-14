import { useEffect, useState, useContext } from "react";
import { Box, CircularProgress, Link, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getMyTransactions } from "../services/transactionService";
import { formatDuration } from "../utils/time";
import { UserContext } from "../contexts/UserContext";
import { Link as RouterLink } from "react-router-dom";
import { esES } from "@mui/x-data-grid/locales";

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

    // Preparing rows
    const rows = transactions.map((tx) => ({
        id: tx.id,
        title: tx.title || "Sin título",
        text: tx.text || "-",
        duration: formatDuration(tx.duration),
        isSender: tx.sender.id === currentUser?.id,
        datetime: new Date(tx.datetime).toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
        }),
        sender: tx.sender,        // full  object to render
        senderName: tx.sender ? `${tx.sender.first_name} ${tx.sender.last_name}` : "-", // string para buscar
        receiver: tx.receiver,
        receiverName: tx.receiver ? `${tx.receiver.first_name} ${tx.receiver.last_name}` : "-",
        offer: tx.offer,
        offerTitle: tx.offer ? tx.offer.title : "-",
    }));

    const columns = [
        { field: "title", headerName: "Título", flex: 1 },
        { field: "text", headerName: "Descripción", flex: 1 },
        {
            field: "duration",
            headerName: "Duración",
            flex: 0.5,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: params.row.isSender ? "red" : "green",
                        fontWeight: "bold",
                    }}
                >
                    {params.row.isSender ? (
                        <>
                            <ArrowUpward fontSize="small" />
                            -{params.value}
                        </>
                    ) : (
                        <>
                            <ArrowDownward fontSize="small" />
                            +{params.value}
                        </>
                    )}
                </Box>
            ),
        },
        { field: "datetime", headerName: "Fecha", flex: 0.5 },
        {
            field: "senderName", // to the search works properly
            headerName: "Emisor",
            flex: 1,
            renderCell: (params) => {
                const user = params.row.sender; // use the original object
                if (!user) return "-";
                return (
                    <Link component={RouterLink} to={`/users/${user.id}`} underline="hover">
                        {user.id === currentUser?.id ? "Tú" : `${user.first_name} ${user.last_name}`}
                    </Link>
                );
            },
        },
        {
            field: "receiverName",
            headerName: "Receptor",
            flex: 1,
            renderCell: (params) => {
                const user = params.row.receiver;
                if (!user) return "-";
                return (
                    <Link component={RouterLink} to={`/users/${user.id}`} underline="hover">
                        {user.id === currentUser?.id ? "Tú" : `${user.first_name} ${user.last_name}`}
                    </Link>
                );
            },
        },
        {
            field: "offerTitle",
            headerName: "Oferta",
            flex: 1,
            renderCell: (params) => {
                const offer = params.row.offer;
                if (!offer) return "-";
                return (
                    <Link component={RouterLink} to={`/offers/${offer.id}`} underline="hover">
                        {offer.title}
                    </Link>
                );
            },
        },
    ];

    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 3, fontWeight: "bold" }}>
                Mis Transacciones
            </Typography>

            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Box sx={{ height: 600 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns.map((col) => ({
                            ...col,
                            minWidth:
                                col.field === "title" ? 150 :
                                col.field === "text" ? 250 :
                                col.field === "duration" ? 100 :
                                col.field === "datetime" ? 100 :
                                col.field === "sender" ? 200 :
                                col.field === "receiver" ? 200 :
                                col.field === "offer" ? 200 : 100,
                            flex: col.flex ?? 1,
                        }))}
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        disableRowSelectionOnClick
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}

                        // Toolbar
                        showToolbar
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                                showExport: true,
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
