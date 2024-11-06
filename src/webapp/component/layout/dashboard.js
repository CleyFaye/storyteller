/* eslint-disable no-magic-numbers */
import {
  withStyles,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
} from "@material-ui/core";
import {Menu as MenuIcon, ChevronLeft as ChevronLeftIcon} from "@material-ui/icons";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";

import EditorSwitch from "../editor/switch.js";
import ProjectSaveButton from "../project/savebutton.js";
import ProjectTitle from "../project/title.js";

import MainMenu from "./mainmenu.js";
import ProjectMenu from "./projectmenu.js";

const drawerWidth = 240;

// eslint-disable-next-line max-lines-per-function
const styles = (theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: `calc(100% - ${drawerWidth}px)`,
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  drawerPaper: {
    position: "relative",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    whiteSpace: "nowrap",
    width: drawerWidth,
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  fixedHeight: {
    height: 240,
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    padding: theme.spacing(2),
  },
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
});

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleDrawerOpen = () => {
    this.setState({open: true});
  };

  handleDrawerClose = () => {
    this.setState({open: false});
  };

  render = () => {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          className={clsx(classes.appBar, this.state.open && classes.appBarShift)}
          position="absolute"
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              aria-label="open drawer"
              className={clsx(classes.menuButton, this.state.open && classes.menuButtonHidden)}
              color="inherit"
              edge="start"
              onClick={this.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              color="inherit"
              component="h1"
              noWrap
              variant="h6"
            >
              <ProjectTitle prefix="Story Teller" />
            </Typography>
            <ProjectSaveButton />
          </Toolbar>
        </AppBar>
        <Drawer
          classes={{
            paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
          variant="permanent"
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <ProjectMenu />
          <MainMenu />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container className={classes.container} maxWidth="lg">
            <EditorSwitch />
          </Container>
        </main>
      </div>
    );
  };
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
