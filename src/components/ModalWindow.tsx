import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalWindowProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  children: React.ReactNode;
}

const ModalWindow: React.FC<ModalWindowProps> = ({
  open,
  onClose,
  title,
  onSave,
  children
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          display: 'flex',
          gap: '16px',
          borderRadius: '16px',
          padding: '16px',
          width: '100%',
          backgroundColor: '#1F2322',
          position: 'relative',
          top: '-20%', // Move the modal up by 20%
          transform: 'translateY(-20%)' // Adjust for centering
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0'
        }}
      >
        <DialogTitle sx={{ padding: '0', color: '#fff' }}>{title}</DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: '#fff' }} />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: '0', overflow: 'hidden' }}>
        {children}
      </DialogContent>
      <DialogActions sx={{ p: '0' }}>
        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            height: '46px',
            borderRadius: '99px',
            bgcolor: '#0AA66E',
            '&:hover': {
              bgcolor: '#00a152'
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalWindow;
