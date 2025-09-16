import { useEffect, useState } from "react";
import { getAllOffers } from "../services/offerService";
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
    InputAdornment
} from "@mui/material";
import CustomButton from "../components/CustomButton";
import OfferCard from "../components/OfferCard";
import SearchIcon from '@mui/icons-material/Search';

export default function OfferList() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    // Applied filters state
    const [filters, setFilters] = useState({
        q: "",
        is_online: null,
        location: "",
        min_duration: "",
        max_duration: ""
    });

    // Temporary state for input values
    const [tempFilters, setTempFilters] = useState(filters);

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
                console.error("Error al obtener ofertas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [filters]);

    // Handler for temporary input changes
    const handleTempFilterChange = (field, value) => {
        setTempFilters(prev => ({ ...prev, [field]: value }));
    };

    // Apply filters to the main state
    const applyFilters = () => {
        setFilters(tempFilters);
    };

    // Reset all filters
    const resetFilters = () => {
        const empty = { q: "", is_online: null, location: "", min_duration: "", max_duration: "" };
        setTempFilters(empty);
        setFilters(empty);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h1" sx={{ mb: 3, fontWeight: "bold" }}>
                Ofertas
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
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

                    {/* Minimum and maximum duration */}
                    <TextField
                        label="Duración mínima (horas)"
                        type="number"
                        size="small"
                        value={tempFilters.min_duration}
                        onChange={e => handleTempFilterChange("min_duration", e.target.value)}
                    />
                    <TextField
                        label="Duración máxima (horas)"
                        type="number"
                        size="small"
                        value={tempFilters.max_duration}
                        onChange={e => handleTempFilterChange("max_duration", e.target.value)}
                    />

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
                </Box>
            </Box>
        </Box>
    );
}
