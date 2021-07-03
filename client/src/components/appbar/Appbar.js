import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import MenuIcon from '@material-ui/icons/Menu';

import DrawerContainer from '../../containers/appbar/DrawerContainer';

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

const useStyles = makeStyles(theme => ({
  appBar: { width: '100vw', backgroundColor: 'white', left: 0 },
  menuButton: { marginLeft: theme.spacing(1) },
  toolbar: {
    ...theme.mixins.toolbar,
    marginBottom: '3em',
    [theme.breakpoints.down('md')]: {
      marginBottom: '4em'
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: '2em'
    }
  },
  indigoButton: {
    ...theme.button,
    ...theme.buttonIndigoAnimation,
    fontSize: '1em',
    padding: '0.4em 2em',
    [theme.breakpoints.down('xs')]: {
      padding: '0.6em 1.2em',
      width: '100%'
    }
  },
  avatar: { backgroundColor: theme.palette.primary.main },
  popOver: { padding: '1em', width: '250px' },
  gridItem: { margin: '0.5em 0' }
}));

const Appbar = ({ drawerOpen, currentUser, setDrawerOpen, signOutStart }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userModalContent = {
    title:
      currentUser.userType === 'Instructor'
        ? currentUser.displayName
        : currentUser.fullName,
    avatar:
      currentUser.userType === 'Instructor'
        ? currentUser.displayName.charAt(0)
        : currentUser.fullName.charAt(0),
    email: currentUser.email
  };

  return (
    <>
      <ElevationScroll>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar style={{ width: '100vw' }} disableGutters>
            <IconButton
              className={classes.menuButton}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon />
            </IconButton>
            <DrawerContainer />
            <div
              style={{ right: '0', position: 'absolute', marginRight: '15px' }}
            >
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <Avatar className={classes.avatar}>
                  {userModalContent.avatar}
                </Avatar>
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={open}
                onClose={handleClose}
              >
                <Grid
                  container
                  className={classes.popOver}
                  direction='column'
                  alignItems='center'
                >
                  <Grid item>
                    <Avatar
                      style={{ height: 60, width: 60, fontSize: 30 }}
                      className={classes.avatar}
                    >
                      {userModalContent.avatar}
                    </Avatar>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <Typography variant='body1'>
                      {userModalContent.title}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.gridItem}>
                    <Typography variant='body1'>
                      {userModalContent.email}
                    </Typography>
                  </Grid>
                  <Divider style={{ width: '200px', margin: '1em 0' }} />
                  <Grid item className={classes.gridItem}>
                    <Button
                      onClick={signOutStart}
                      variant='outlined'
                      className={classes.indigoButton}
                      color='primary'
                    >
                      Sign out
                    </Button>
                  </Grid>
                </Grid>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbar} />
    </>
  );
};

export default Appbar;
