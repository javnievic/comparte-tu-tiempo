// src/components/DurationSlider.jsx
import { Box, Typography, Slider } from "@mui/material";
import theme from "../styles/theme";
import { formatMinutesToHHMM } from "../utils/time";

export default function DurationSlider({
    value,
    onChange,
    min = 15,
    max = 240,
    step = 15,
}) {
    const marks = [
        { value: min, label: formatMinutesToHHMM(min) },
        { value: 60, label: "01:00" },
        { value: 120, label: "02:00" },
        { value: 180, label: "03:00" },
        { value: max, label: formatMinutesToHHMM(max) },
    ];

    return (
        <Box
            sx={{
                mt: 3,
                mb: 3,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                textAlign: "center",
                "&:hover": { borderColor: theme.palette.text.primary },
            }}
        >
            <Typography variant="subtitle1" gutterBottom>
                Duración estimada
            </Typography>

            <Box sx={{ width: "100%", maxWidth: 520, mx: "auto", px: 2 }}>
                <Slider
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    marks={marks}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(val) => formatMinutesToHHMM(val)}
                    onChange={onChange}
                    sx={{
                        color: theme.palette.primary.main,
                        "& .MuiSlider-thumb": {
                            backgroundColor: "#fff",
                            border: "2px solid",
                            borderColor: theme.palette.primary.main,
                        },
                        "& .MuiSlider-markLabel": {
                            fontSize: "0.75rem",
                        },
                    }}
                />
            </Box>

            <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                {formatMinutesToHHMM(value)} horas
            </Typography>
        </Box>
    );
}
