import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import history from '../../history';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Textfield from '../fields/Textfield';
import NotificationContainer from '../../containers/NotificationContainer';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: '100vh',
    backgroundColor: '#f5f8fb'
  },
  rowContainer: {
    width: '25vw',
    border: `1px solid ${theme.palette.common.grey500}`,
    padding: '2em',
    background: 'white',
    [theme.breakpoints.down('md')]: {
      width: '50vw'
    },
    [theme.breakpoints.down('sm')]: {
      width: '65vw'
    },
    [theme.breakpoints.down('xs')]: {
      width: '90vw'
    }
  },
  formContainer: { margin: '1.5em 0' },
  indigoButton: {
    ...theme.button,
    ...theme.buttonIndigoAnimation,
    fontSize: '1em',
    padding: '0.4em 2em',
    [theme.breakpoints.down('xs')]: {
      padding: '0.8em 1.4em',
      width: '85%'
    }
  }
}));

const Signin = ({ reset, handleSubmit, emailSignInStart, status }) => {
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async ({ email, password }) => {
    emailSignInStart({ email, password });
    reset();
  };

  return (
    <Grid
      container
      justify='center'
      alignItems='center'
      className={classes.mainContainer}
    >
      <Grid item container direction='column' className={classes.rowContainer}>
        <Grid item>
          <Typography variant='h5'>Sign in</Typography>
          <Typography
            variant='body1'
            style={{ fontWeight: 'bold', color: 'red' }}
          >
            If you are an instructor you must first register an account
          </Typography>
        </Grid>
        <Grid item className={classes.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field name='email' component={Textfield} fullWidth label='Email' />
            <Field
              type={showPassword ? 'text' : 'password'}
              name='password'
              component={Textfield}
              fullWidth
              label='Password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      disableRipple
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Grid
              container
              direction='column'
              spacing={2}
              style={{ width: '100%', marginTop: '1em' }}
            >
              <Grid item>
                <Button
                  type='submit'
                  variant='outlined'
                  className={classes.indigoButton}
                  color='primary'
                >
                  Sign in
                </Button>
              </Grid>
              <Grid item>
                <Typography variant='body1'>
                  Not yet registered?
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => history.push('/signup')}
                  >
                    {' '}
                    <strong>Register an account</strong>
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <NotificationContainer status={status} noTimeOut={true} />
      </Grid>
    </Grid>
  );
};

const validate = values => {
  const errors = {};

  const requiredFields = ['email', 'password'];

  requiredFields.forEach(field => {
    if (!values[field]) errors[field] = 'Required';
  });

  return errors;
};

export default reduxForm({
  form: 'signinForm',
  validate
})(Signin);
