import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import SelectField from '../fields/SelectField';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120
  },
  buttonContainer: {
    margin: '1em 0'
  },
  greenButton: {
    ...theme.button,
    ...theme.buttonGreenAnimation,
    fontSize: '1em',
    margin: '1em'
  }
}));

const StudentList = ({
  currentCourse,
  courseStudents,
  studentList,
  instructorUpdateAttendanceStart,
  handleSubmit,
  pristine,
  markAllAs
}) => {
  const classes = useStyles();

  const onSubmit = formValues => {
    if (markAllAs && markAllAs.length) {
      const newFormValues = Object.keys(formValues).reduce((res, key) => {
        if (_.isObject(formValues[key])) res[key] = { status: markAllAs };
        return res;
      }, {});
      instructorUpdateAttendanceStart(currentCourse.docId, newFormValues);
    } else {
      instructorUpdateAttendanceStart(currentCourse.docId, formValues);
    }
  };

  const formatStudents = () => {
    if (
      courseStudents &&
      courseStudents.length &&
      studentList &&
      studentList.length
    ) {
      return _.compact(
        _.flattenDeep(
          courseStudents.map(cStudent =>
            studentList.map(lStudent =>
              cStudent.docId === lStudent.docId
                ? {
                    fullName: cStudent.fullName,
                    docId: cStudent.docId,
                    timeStamp: lStudent.timestamp
                      ? `${moment(lStudent.timestamp.toDate()).format('llll')}`
                      : 'N/A'
                  }
                : null
            )
          )
        )
      );
    }
  };

  return courseStudents &&
    courseStudents.length &&
    studentList &&
    studentList.length ? (
    <Grid container direction='column' style={{ padding: '0 1em' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item>
          <Field
            classes={{ root: classes.formControl }}
            name='markAllAs'
            component={SelectField}
            label='Mark all as'
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {['Present', 'Absent', 'Excused'].map((status, i) => (
              <MenuItem key={i} value={status}>
                {status}
              </MenuItem>
            ))}
          </Field>
        </Grid>
        {formatStudents().map((student, i) => {
          return (
            <Grid
              key={i}
              container
              direction='row'
              alignItems='center'
              justify='space-between'
            >
              <Grid item>
                <Typography variant='body1'>{student.fullName}</Typography>
              </Grid>
              <Grid
                item
                container
                direction='column'
                style={{ width: '50%', margin: '0 1em' }}
              >
                <Grid item style={{ margin: '1em' }}>
                  <Field
                    classes={{ root: classes.formControl }}
                    name={`${student.docId}.status`}
                    component={SelectField}
                    label='Status'
                    markAllAs={markAllAs}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {['Present', 'Absent', 'Excused'].map((status, i) => (
                      <MenuItem key={i} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item>
                  <Typography variant='body1'>
                    Last sign in: {student.timeStamp}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
        <Grid
          container
          direction='row'
          justify='flex-end'
          className={classes.buttonContainer}
        >
          <Grid item>
            <Button
              disabled={pristine}
              type='submit'
              variant='outlined'
              className={classes.greenButton}
              color='primary'
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  ) : null;
};

const selector = formValueSelector('studentAttendance');

const mapStateToProps = (state, ownProps) => ({
  initialValues: Object.fromEntries(
    ownProps.courseStudents.map(s => [s.docId, { status: s.attendanceStatus }])
  ),
  markAllAs: selector(state, 'markAllAs')
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'studentAttendance',
    enableReinitialize: true
  })(StudentList)
);
