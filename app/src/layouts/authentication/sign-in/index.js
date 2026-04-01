

import { useState, useContext, useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { manageFunc } from 'App';
import { ConnectWalletAPI } from './../../../api/operations/wallet';
import { getUserBalanceByRpc } from './../../../api/balance';
function Basic() {
  const { wallet, setWallet, setBalance } = useContext(manageFunc);
  const navigate = useNavigate();

  // Redirect if already connected
  useEffect(() => {
    if (wallet) {
      navigate("/dashboard");
    }
  }, [wallet, navigate]);

  const handleConnectWallet = async () => {
    try {
      const wal = await ConnectWalletAPI();
      if (wal && wal.success && wal.wallet) {
        localStorage.setItem('wallet', wal.wallet);
        setWallet(wal.wallet);
        fetchBal(wal.wallet);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDemoConnect = () => {
    const mockWallet = "tz1MockAddressDemo123456789";
    localStorage.setItem('wallet', mockWallet);
    setWallet(mockWallet);
    // Mock balance
    setBalance(100.00); 
    navigate("/dashboard");
  };

  const handleDisconnect = async () => {
    localStorage.removeItem('wallet');
    setWallet(null);
    setBalance(null);
  };

  const fetchBal = async (address) => {
    if (!address) return;
    const res = await getUserBalanceByRpc(address);
    if (res && res.success) {
      setBalance(res.balance);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card
        sx={({ breakpoints }) => ({
          width: "100%",
          maxWidth: { xs: "90vw", sm: "400px", md: "450px" },
          mx: "auto",
          backdropFilter: "blur(20px)",
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
        })}
      >
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2.125rem" } }}>
            Academic Reward System
          </MDTypography>
          
          <MDBox textAlign="center" my={1} >
            <MDTypography variant="caption" color="white">
              {wallet ? "Securely connected. Redirecting..." : "Connect your Tezos wallet to claim academic tokens and NFTs"}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {!wallet && (
              <>
                <MDBox mt={2} mb={1}>
                  <MDButton 
                    variant="gradient" 
                    color="info" 
                    onClick={handleConnectWallet} 
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      background: ({ palette: { info, gradients }, functions: { linearGradient } }) =>
                        linearGradient(gradients.info.main, gradients.info.state),
                    }}
                  >
                    Connect Wallet
                  </MDButton>
                </MDBox>
                <MDBox mt={2} mb={1}>
                  <MDButton variant="outlined" color="secondary" onClick={handleDemoConnect} fullWidth>
                    Demo Mode (Skip Connect)
                  </MDButton>
                </MDBox>
              </>
            )}
            {wallet && (
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" onClick={() => navigate("/dashboard")} fullWidth sx={{ mb: 1, py: 1.2 }}>
                  Go to Admin Dashboard
                </MDButton>
                <MDButton variant="gradient" color="success" onClick={() => navigate("/profile")} fullWidth sx={{ mb: 1, py: 1.2 }}>
                  Go to Student Profile
                </MDButton>
                <MDButton variant="outlined" color="error" onClick={handleDisconnect} fullWidth sx={{ py: 1 }}>
                  Disconnect Wallet
                </MDButton>
              </MDBox>
            )}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
