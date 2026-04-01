
import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Images (using placeholders or icons)
const networks = [
  { name: "Temple Wallet", icon: "https://templewallet.com/logo.png", color: "info" },
  { name: "Kukai Wallet", icon: "https://wallet.kukai.app/favicon.ico", color: "secondary" },
  { name: "Naan Wallet", icon: "https://naanwallet.com/favicon.ico", color: "primary" },
  { name: "Beacon / Mobile", icon: "https://cryptologos.cc/logos/tezos-xtz-logo.png", color: "dark" },
];

function MultiConnectModal({ open, onClose, onSelect }) {
  return (
    <Modal open={open} onClose={onClose}>
      <MDBox
        sx={({ palette: { white }, breakpoints, boxShadows: { xxl } }) => ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: pxToRem(400),
          backgroundColor: white.main,
          borderRadius: "1rem",
          boxShadow: xxl,
          p: 4,
          outline: 0,
          [breakpoints.down("sm")]: {
            width: "90%",
          },
        })}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h5" fontWeight="medium">
            Select Network
          </MDTypography>
          <Icon
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={onClose}
          >
            close
          </Icon>
        </MDBox>
        <MDTypography variant="button" color="text" fontWeight="regular" mb={3} display="block">
          Connect your wallet to one of the supported blockchain networks.
        </MDTypography>
        <Divider />
        <MDBox mt={2}>
          <Grid container spacing={2}>
            {networks.map((network) => (
              <Grid item xs={12} key={network.name}>
                <MDButton
                  variant="outlined"
                  color={network.color}
                  fullWidth
                  onClick={() => onSelect(network.name)}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    textTransform: "none",
                    py: 1.5,
                  }}
                >
                  <MDBox
                    component="img"
                    src={network.icon}
                    alt={network.name}
                    width="1.5rem"
                    mr={2}
                  />
                  <MDTypography variant="button" fontWeight="medium">
                    {network.name}
                  </MDTypography>
                </MDButton>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

// Helper to convert px to rem (matching the theme utils if possible)
const pxToRem = (number, baseNumber = 16) => `${number / baseNumber}rem`;

MultiConnectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MultiConnectModal;
