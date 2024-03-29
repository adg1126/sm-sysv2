import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';

import SwitchGroup from '../fields/SwitchGroup';
import Textfield from '../fields/Textfield';

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    marginTop: '1.5em'
  },
  greenButton: {
    ...theme.button,
    ...theme.buttonGreenAnimation,
    fontSize: '1em'
  },
  redButton: {
    ...theme.button,
    ...theme.buttonRedAnimation,
    fontSize: '1em',
    marginRight: '1em'
  }
}));

const DaysMeetAndTime = ({ daysMeet, input, ivDaysMeetAndTime }) =>
  [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ].map((day, i) => (
    <Grid
      key={i}
      style={{
        visibility: daysMeet && daysMeet.includes(day) ? 'visible' : 'hidden'
      }}
      container
      direction='row'
      spacing={3}
      justify='center'
    >
      <Grid item>
        <Field
          disabled={
            ivDaysMeetAndTime === undefined || ivDaysMeetAndTime === null
              ? false
              : ivDaysMeetAndTime.length && ivDaysMeetAndTime
              ? true
              : false
          }
          name={`${input.name}.${day}.startTime`}
          component={Textfield}
          label='Start Time'
          type='time'
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
        />
      </Grid>
      <Grid item>
        <Field
          disabled={
            ivDaysMeetAndTime === undefined || ivDaysMeetAndTime === null
              ? false
              : ivDaysMeetAndTime.length && ivDaysMeetAndTime
              ? true
              : false
          }
          name={`${input.name}.${day}.endTime`}
          component={Textfield}
          label='End Time'
          type='time'
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
        />
      </Grid>
    </Grid>
  ));

let CourseForm = props => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));

  const { pristine, reset, setModalOpen, modalName, daysMeet, initialValues } =
    props;

  const onSubmit = ({ daysMeet, daysMeetAndTime, ...rest }) => {
    props.onSubmit({
      daysMeet,
      daysMeetAndTime: _.pick(daysMeetAndTime, daysMeet),
      ...rest
    });
    reset();
  };

  return (
    <form onSubmit={props.handleSubmit(onSubmit)}>
      <Field
        type='text'
        name='courseCode'
        component={Textfield}
        label='Course Code'
        fullWidth
      />
      <Field
        type='text'
        name='courseName'
        component={Textfield}
        label='Course Name'
        fullWidth
      />
      <Field
        style={{ marginRight: '2em' }}
        name='courseDates.startDate'
        component={Textfield}
        label='Start Date'
        type='date'
        InputLabelProps={{
          shrink: true
        }}
      />
      <Field
        name='courseDates.endDate'
        component={Textfield}
        label='End Date'
        type='date'
        InputLabelProps={{
          shrink: true
        }}
      />
      {matchesXS ? null : (
        <>
          <Typography style={{ color: 'red', marginTop: '1em' }}>
            Once MeetingDays is set you won't be able to update it again.
          </Typography>
          <Grid container direction='row' justify='space-between'>
            <Grid item container style={{ width: '28%' }}>
              <FormGroup style={{ margin: '1em 0' }}>
                <FormLabel style={{ color: 'black', margin: '0.5em 0' }}>
                  Meeting Days
                </FormLabel>
                <Field
                  name='daysMeet'
                  component={SwitchGroup}
                  options={[
                    { id: 1, name: 'monday' },
                    { id: 2, name: 'tuesday' },
                    { id: 3, name: 'wednesday' },
                    { id: 4, name: 'thursday' },
                    { id: 5, name: 'friday' },
                    { id: 6, name: 'saturday' },
                    { id: 7, name: 'sunday' }
                  ]}
                  iVDaysMeet={initialValues && initialValues.daysMeet}
                />
              </FormGroup>
            </Grid>
            <Grid item container style={{ width: '72%', marginTop: '4em' }}>
              <Field
                name='daysMeetAndTime'
                component={DaysMeetAndTime}
                daysMeet={daysMeet}
                ivDaysMeetAndTime={
                  initialValues && _.keys(initialValues.daysMeetAndTime)
                }
              />
            </Grid>
          </Grid>
        </>
      )}
      <Grid container className={classes.buttonContainer}>
        <Grid item>
          {setModalOpen ? (
            <Button
              variant='outlined'
              className={classes.redButton}
              onClick={() => setModalOpen(modalName, false)}
            >
              Cancel
            </Button>
          ) : null}
        </Grid>
        <Grid item>
          <Button
            disabled={pristine}
            type='submit'
            variant='outlined'
            className={classes.greenButton}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const validate = values => {
  const errors = {};

  const requiredFields = ['courseCode', 'courseName', 'courseDates'];
  requiredFields.forEach(field => {
    if (field !== 'courseDates') {
      if (!values[field]) errors[field] = 'Required';
    } else {
      errors[field] = {};
      if (!values[field]) errors[field]['startDate'] = 'Required';
      if (!values[field]) errors[field]['endDate'] = 'Required';
    }
  });

  return errors;
};

const selector = formValueSelector('courseForm');

const mapStateToProps = state => ({
  daysMeet: selector(state, 'daysMeet')
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'courseForm',
    validate
  })(CourseForm)
);
