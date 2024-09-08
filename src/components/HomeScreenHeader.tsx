import { Box, Typography } from "@mui/material";

export const HomeScreenHeader = () => {
  return (
    <Box sx={{ maxWidth: "328px" }}>
      <Typography
        sx={{
          fontSize: "28px",
          fontWeight: "600",
          lineHeight: "36px",
          textAlign: "center",
          color: "#fff",
          pb: "16px",
        }}
      >
        ForgeAI
      </Typography>
      <Typography
        sx={{
          fontSize: "17px",
          fontWeight: "400",
          lineHeight: "22px",
          textAlign: "center",
          color: "#FFFFFFA3",
          pb: "32px",
        }}
      >
        Ассистенты, которые превращают идеи в результаты.
      </Typography>
    </Box>
  );
};

export default HomeScreenHeader;
