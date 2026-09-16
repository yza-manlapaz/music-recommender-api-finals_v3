import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
  } from "@mui/material";
  
  interface SearchBarProps {
    query: string;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
    loading: boolean;
  }
  
  function SearchBar({
    query,
    onQueryChange,
    onSearch,
    loading,
  }: SearchBarProps) {
    return (
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#181818",
          borderRadius: 4,
          p: 3,
          border: "1px solid #282828",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2, color: "white" }}
        >
          Find your music
        </Typography>
  
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search songs or artists..."
            value={query}
            onChange={(event) =>
              onQueryChange(event.target.value)
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#242424",
                color: "white",
                borderRadius: 3,
  
                "& fieldset": {
                  borderColor: "#3a3a3a",
                },
  
                "&:hover fieldset": {
                  borderColor: "#666",
                },
  
                "&.Mui-focused fieldset": {
                  borderColor: "#1ed760",
                },
              },
  
              "& input::placeholder": {
                color: "#a7a7a7",
                opacity: 1,
              },
            }}
          />
  
          <Button
            variant="contained"
            onClick={onSearch}
            disabled={loading}
            sx={{
              px: 4,
              bgcolor: "#1ed760",
              color: "#000",
              fontWeight: 700,
              borderRadius: 3,
              textTransform: "none",
              minHeight: 48,
  
              "&:hover": {
                bgcolor: "#1fdf64",
              },
            }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Box>
      </Paper>
    );
  }
  
  export default SearchBar;