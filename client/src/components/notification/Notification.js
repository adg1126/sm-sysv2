import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

const Notification = ({
  status,
  notificationOpen,
  setNotificationOpen,
  noTimeOut
}) => {
  const classes = useStyles();

  useEffect(() => {
    if ((status && status.success.length) || (status && status.err.length)) {
      setNotificationOpen(true);
    }
  }, [status, setNotificationOpen]);

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return status ? (
    <div className={classes.root}>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={noTimeOut ? null : 4000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={status.success ? 'success' : 'error'}
        >
          {status.success || status.err}
        </Alert>
      </Snackbar>
    </div>
  ) : null;
};

export default Notification;
