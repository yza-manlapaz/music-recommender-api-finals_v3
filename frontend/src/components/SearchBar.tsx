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
          bgcolor: "#background.paper",
          borderRadius: 4,
          p: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
        variant="h6"
        sx={{ 
            fontWeight: 700, 
            mb: 2, 
            color: "text.primary" 
        }}
        >
          Find your music
        </Typography>
  
        <Box
          sx={{
            display: "flex",
            flexDirection: { 
                xs: "column", 
                sm: "row" 
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search songs or artists..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !loading) {
                onSearch();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#action.hover",
                color: "text.primary",
                borderRadius: 3,
  
                "& fieldset": {
                  borderColor: "divider",
                },
  
                "&:hover fieldset": {
                  borderColor: "text.secondary",
                },
  
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
  
              "& input::placeholder": {
                color: "text.secondary",
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
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 700,
              borderRadius: 3,
              textTransform: "none",
              minHeight: 48,
  
              "&:hover": {
                bgcolor: "primary.dark",
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