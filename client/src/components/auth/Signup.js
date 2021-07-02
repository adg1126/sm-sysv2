import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import history from '../../history';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Textfield from '../fields/Textfield';
import SelectField from '../fields/SelectField';

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
  formControl: { minWidth: 120 },
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

const Signup = ({ reset, handleSubmit, signUpStart }) => {
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async ({ displayName, email, password, userType }) => {
    signUpStart({ displayName, email, password, userType });
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
          <Typography variant='h5'>Create an account</Typography>
          <Typography
            variant='body1'
            style={{ fontWeight: 'bold', color: 'red' }}
          >
            For instructors only
          </Typography>
        </Grid>
        <Grid item className={classes.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction='column'>
              <Grid item>
                <Field
                  name='displayName'
                  component={Textfield}
                  label='Full Name'
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Field
                  name='email'
                  component={Textfield}
                  label='Email'
                  fullWidth
                />
              </Grid>
              <Grid item style={{ margin: '1em 0' }}>
                <Field
                  classes={{ root: classes.formControl }}
                  name={'userType'}
                  component={SelectField}
                  label='User Type'
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {['Instructor'].map((status, i) => (
                    <MenuItem key={i} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  component={Textfield}
                  label='Password'
                  fullWidth
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
              </Grid>
              <Grid item>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  component={Textfield}
                  label='Confirm Password'
                  fullWidth
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
              </Grid>
            </Grid>
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
                  Register
                </Button>
              </Grid>
              <Grid item>
                <Typography variant='body1'>
                  Already have an account?
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => history.push('/signin')}
                  >
                    {' '}
                    <strong>Login here</strong>
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

const validate = values => {
  const errors = {};

  const requiredFields = [
    'displayName',
    'email',
    'password',
    'confirmPassword',
    'userType'
  ];

  if (values.password !== values.confirmPassword) {
    errors.password = "Password don't match";
    errors.confirmPassword = "Password don't match";
  }

  requiredFields.forEach(field => {
    if (!values[field]) errors[field] = 'Required';
  });

  return errors;
};

export default reduxForm({
  form: 'signupForm',
  validate
})(Signup);
