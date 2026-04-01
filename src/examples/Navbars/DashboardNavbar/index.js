

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes, { number } from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import NCUicon from "assets/images/icons/icon.png"


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";


// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

import {
  ConnectWalletAPI,
  FetchWalletAPI,
  DisconnectWalletAPI,
} from "api/operations/wallet";
import MDButton from "components/MDButton";
import { getUserBalanceByRpc } from "api/balance";

import { getTezBalance } from "api/balance";
import { useContext } from 'react';
import { manageFunc } from "App";

// setWallet ,setBalance , balance , wallet

function DashboardNavbar({ absolute, light, isMini}) {
  const {setWallet ,setBalance , balance , wallet} = useContext(manageFunc);
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const { pathname } = useLocation();
  const route = pathname.split("/").slice(1);
  const isConnect = pathname === '/connect' || pathname === '/';

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });
  // wallet function

  // const [balance, setBalance] = useState(null);
  // const [wallet, setWallet] = useState(null);
  let res = null;
  const nwallet = null;
  const fetchBal = async (address) => {
    res = await getUserBalanceByRpc(address);
    // const tez = await getTezBalance(address);
    setBalance(res.balance);
  };  

  useEffect(() => {
    if(wallet && wallet != null) {
      localStorage.setItem( 'wallet', wallet );
    }  
  }, [wallet]);
  
  const handleConnectWallet = async () => {
    const wal = await ConnectWalletAPI();
    if (wal && wal.success && wal.wallet) {
      setWallet(wal.wallet);
      fetchBal(wal.wallet);
    }
  };
  const handleDisconnectWallet = async () => {
    await DisconnectWalletAPI();
    localStorage.removeItem('wallet');
    setWallet(null);
    setBalance(null);
  };

  // useEffect(() => {
  //   const func = async () => {
  //     const account = await FetchWalletAPI();
  //     if (account) {
  //       setWallet(account.address);
  //     }
  //   };
  //   func();
  // }, []);



  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title="Academic Rewards" route={route} light={light} />
        </MDBox>
        {isMini || isConnect ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
           
            {
              balance ? 
              <MDBox display="flex" alignItems="center" mr={3}>
                {<MDBox component="img" src={NCUicon} alt="Brand" width="2rem" mr={1} />}
                <MDBox
                  width={"100%"}
                  
                >
                  <MDTypography component="h6" variant="button" fontWeight="medium" >
                    {balance}
                  </MDTypography>
                </MDBox>
              </MDBox>
            : <></>
            }
            <MDButton
              variant="gradient" 
              color="info"
              onClick={wallet ? handleDisconnectWallet : handleConnectWallet}
              sx={{
                borderRadius: "0.5rem",
                px: 3,
                textTransform: "none",
                boxShadow: ({ boxShadows: { md } }) => md,
              }}
            >
              <MDBox mr={1} display="flex" alignItems="center">
                <Icon>account_balance_wallet</Icon>
              </MDBox>
              {wallet
                ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
                : "Connect Wallet"}
            </MDButton>
            <MDBox color={light ? "white" : "inherit"}>
              {/* <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link> */}
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
                style={{ zIndex: 1000 }}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
                style={{ zIndex: 1000 }}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton> */}
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
