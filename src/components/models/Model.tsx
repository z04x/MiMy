import { Button, Box, Typography } from "@mui/material";
import { ModelDetails } from "../../interfaces/ModelDetails";

interface ModelProps {
  handleButtonClick: (modelId: string) => void;
  modelDetails: ModelDetails;
}

const ModelComponent: React.FC<ModelProps> = ({
  handleButtonClick,
  modelDetails,
}) => {
  return (
    <Button
      variant="text"
      onClick={() => handleButtonClick(modelDetails.assistant_code)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "89px",
          height: "100%",
        }}
      >
        <img src={modelDetails.logo_url} alt="Robot" />
      </Box>
      <Box sx={{ maxWidth: "300px" }}>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "17px",
            fontWeight: "500",
            lineHeight: "22px",
            textAlign: "left",
            color: "#fff",
          }}
        >
          {modelDetails.label}
          {modelDetails.is_premium && (
            <img
              src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/premium-icon.svg"
              alt="Premium"
            />
          )}
        </Typography>
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: "400",
            lineHeight: "22px",
            textAlign: "left",
            color: "#FFFFFFA3",
          }}
        >
          {modelDetails.short_description}
        </Typography>
      </Box>
    </Button>
  );
};

export default ModelComponent;
