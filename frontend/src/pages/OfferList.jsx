import { useEffect, useState } from "react";
import { getAllOffers } from "../services/offerService";
import { getAllUsers } from "../services/userService";
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Divider,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    InputAdornment,
    Slider,
    MenuItem,
    Avatar
} from "@mui/material";
import CustomButton from "../components/CustomButton";
import OfferCard from "../components/OfferCard";
import SearchIcon from '@mui/icons-material/Search';
import { formatMinutesToHHMM } from "../utils/time";

export default function OfferList() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    // Users list for filter
    const [users, setUsers] = useState([]);

    // Applied filters state
    const [filters, setFilters] = useState({
        q: "",
        is_online: null,
        location: "",
        min_duration: "",
        max_duration: "",
        user: ""
    });

    // Temporary state for input values
    const [tempFilters, setTempFilters] = useState(filters);
    const [filtersApplied, setFiltersApplied] = useState(false);


    // Fetch offers with applied filters
    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== "" && value !== null) query.append(key, value);
                });

                const data = await getAllOffers(`?${query.toString()}`);
                setOffers(data);
                setVisibleCount(9);
            } catch (error) {
                console.error("Error fetching offers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [filters]);

    // Fetch users for filter
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers(); // call the service to get users
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Handler for temporary input changes
    const handleTempFilterChange = (field, value) => {
        setTempFilters(prev => ({ ...prev, [field]: value }));
    };

    // Apply filters to the main state
    const applyFilters = () => {
        setFilters(tempFilters);
        setFiltersApplied(true);
    };

    // Reset all filters
    const resetFilters = () => {
        const empty = { q: "", is_online: null, location: "", min_duration: "", max_duration: "", user: "" };
        setTempFilters(empty);
        setFilters(empty);
        setFiltersApplied(true);
    };
    
    useEffect(() => {
        if (filtersApplied) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setFiltersApplied(false);
        }
    }, [offers, filtersApplied]);

    return (
        <Box>
            <Typography variant="h1" sx={{ mb: 3, fontWeight: "bold" }}>
                Ofertas
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2.5
                }}
            >
                {/* Filters panel */}
                <Box
                    sx={{
                        width: { xs: "295px", md: "295px" },
                        maxWidth: "295px",
                        flexShrink: 0,
                        border: "1px solid",
                        borderColor: "border.dark",
                        p: 3,
                        height: "fit-content",
                        mx: "auto",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}
                >
                    <Typography variant="h4">Filtros</Typography>
                    <Divider />

                    {/* Search field */}
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        size="small"
                        value={tempFilters.q}
                        onChange={e => handleTempFilterChange("q", e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Location field */}
                    <TextField
                        label="Ubicación"
                        variant="outlined"
                        size="small"
                        value={tempFilters.location}
                        onChange={e => handleTempFilterChange("location", e.target.value)}
                    />

                    {/* User selector with avatar */}
                    <TextField
                        select
                        label="Usuario"
                        size="small"
                        value={tempFilters.user || ""}
                        onChange={e => handleTempFilterChange("user", e.target.value)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {users.map(user => (
                            <MenuItem key={user.id} value={user.id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Avatar
                                        src={user.profile_picture || "/images/default_user.webp"}
                                        sx={{ width: 28, height: 28 }}
                                    />
                                    <Typography variant="body2">
                                        {user.full_name}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Online mode */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.is_online === true}
                                onChange={e =>
                                    handleTempFilterChange("is_online", e.target.checked ? true : null)
                                }
                            />
                        }
                        label="Solo online"
                    />

                    {/* Duration slider */}
                    <Box>
                        <Typography gutterBottom>Duración</Typography>
                        <Slider
                            value={[
                                tempFilters.min_duration ? tempFilters.min_duration * 60 : 15, // convert hours to minutes
                                tempFilters.max_duration ? tempFilters.max_duration * 60 : 240
                            ]}
                            onChange={(e, newValue) => {
                                handleTempFilterChange("min_duration", newValue[0] / 60); // to decimals
                                handleTempFilterChange("max_duration", newValue[1] / 60);
                            }}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(val) => formatMinutesToHHMM(val)}
                            min={15}   // 15 minutes
                            max={240}  // 4 hours
                            step={15}  // 15 minutes
                            marks={[
                                { value: 15, label: formatMinutesToHHMM(15) },
                                { value: 60, label: "01:00" },
                                { value: 120, label: "02:00" },
                                { value: 180, label: "03:00" },
                                { value: 240, label: formatMinutesToHHMM(240) },
                            ]}
                            sx={{
                                color: "primary.main",
                                "& .MuiSlider-thumb": { backgroundColor: "#fff", border: "2px solid", borderColor: "primary.main" },
                                "& .MuiSlider-markLabel": { fontSize: "0.75rem" },
                            }}
                        />
                    </Box>

                    {/* Action buttons */}
                    <CustomButton variant="contained" onClick={applyFilters}>
                        Aplicar filtros
                    </CustomButton>
                    <Button onClick={resetFilters}>
                        Limpiar filtros
                    </Button>
                </Box>

                {/* Offers list */}
                <Box sx={{ flexGrow: 1 }}>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : offers.length === 0 ? (
                        <Typography sx={{ mt: 5, textAlign: "center" }}>
                            No hay ofertas para los filtros seleccionados.
                        </Typography>
                    ) : (
                        <>
                            <Grid container spacing={2.5}>
                                {offers.slice(0, visibleCount).map((offer) => (
                                    <Grid size={{ xs: 12, sm: 10, md: 6, lg: 4 }} key={offer.id}>
                                        <OfferCard offer={offer} />
                                    </Grid>
                                ))}
                            </Grid>
                            {visibleCount < offers.length && (
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                    <CustomButton variant="contained" onClick={() => setVisibleCount(prev => prev + 9)}>
                                        Cargar más
                                    </CustomButton>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
