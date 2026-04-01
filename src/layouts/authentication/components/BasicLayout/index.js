

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication pages components
import Footer from "layouts/authentication/components/Footer";

function BasicLayout({ image, children }) {
  return (
    <PageLayout background="transparent">
      
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        height="100%"
        top={0}
        left={0}
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          zIndex: -1,
        }}
      />
      <MDBox px={0} width="100%" height="100vh" mx="auto" position="relative" display="flex" flexDirection="column">
        <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1, py: 6 }}>
          <Grid item xs={11} sm={9} md={6} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
        <Footer light />
      </MDBox>
    </PageLayout>
  );
}

// Typechecking props for the BasicLayout
BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
