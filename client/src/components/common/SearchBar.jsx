import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <TextField
    fullWidth
    size="small"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" color="action" />
        </InputAdornment>
      ),
    }}
    sx={{
      minWidth: { xs: "100%", sm: 280 },
      "& .MuiOutlinedInput-root": {
        borderRadius: 3,
        bgcolor: "background.paper",
      },
    }}
  />
);

export default SearchBar;
