import React, { useEffect, useCallback } from 'react';
import moment from 'moment';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import ReusableCard from '../../components/ReusableCard';
import Timer from '../../components/Timer';
import NotificationContainer from '../../containers/NotificationContainer';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '100vw'
  },
  header: {
    marginBottom: '3em'
  },
  greenButton: {
    backgroundColor: theme.palette.common.green,
    color: 'white',
    fontSize: '1em'
  },
  redButton: {
    ...theme.buttonRedAnimation,
    fontSize: '1em'
  },
  button: {
    ...theme.button,
    fontSize: '1em'
  }
}));

const CourseCard = ({
  course,
  studentId,
  studentTimestamp,
  studentUpdateAttendanceStart
}) => {
  const { id, courseDocId, title, students, startDate, endDate } = course,
    classes = useStyles(),
    student = students.find(({ docId }) => docId === studentId),
    now = moment().toDate(),
    allowAttendanceUpdateAfter = moment(endDate).subtract(15, 'minutes');

  const updateStudent = useCallback(() => {
    if (
      now >= allowAttendanceUpdateAfter.toDate() &&
      now <= endDate &&
      !student.attendanceStatus.length
    ) {
      allowAttendanceUpdateAfter - startDate < now - studentTimestamp
        ? studentUpdateAttendanceStart(courseDocId, {
            ...student,
            id,
            attendanceStatus: 'Present'
          })
        : studentUpdateAttendanceStart(courseDocId, {
            ...student,
            id,
            attendanceStatus: 'Absent'
          });
    }
  }, [
    allowAttendanceUpdateAfter,
    courseDocId,
    endDate,
    id,
    now,
    startDate,
    student,
    studentTimestamp,
    studentUpdateAttendanceStart
  ]);

  useEffect(() => {
    setTimeout(() => {
      updateStudent();
    }, 1000);
  }, [updateStudent]);

  const cardContent = {
    header: (
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
      >
        <Grid item>
          <Typography style={{ color: 'black' }} variant='h5'>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ color: 'black' }} variant='body1'>
            {`${moment(startDate).format('hh:mm a')} - ${moment(endDate).format(
              'hh:mm a'
            )}`}
          </Typography>
        </Grid>
      </Grid>
    ),
    content: <></>,
    actions: (
      <Grid container direction='column'>
        <Grid
          item
          style={{ marginBottom: '0.5em' }}
          container
          direction='row'
          spacing={2}
        >
          {now >= allowAttendanceUpdateAfter.toDate() && now <= endDate ? (
            <>
              <Grid item>
                <Typography variant='body1'>Set attendance after</Typography>
              </Grid>
              <Grid item>
                <Timer
                  startDate={startDate}
                  endDate={allowAttendanceUpdateAfter}
                />
              </Grid>
            </>
          ) : null}
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            value={student.attendanceStatus}
            exclusive
            aria-label='text alignment'
          >
            <ToggleButton
              disabled
              className={classes.button}
              value='Present'
              aria-label='left aligned'
            >
              Present
            </ToggleButton>
            <ToggleButton
              disabled
              className={[classes.button].join(' ')}
              value='Absent'
              aria-label='centered'
            >
              Absent
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    )
  };

  return <ReusableCard {...cardContent} />;
};

const Courses = ({
  attendanceCourseList,
  student,
  status,
  studentUpdateAttendanceStart
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));

  const today = moment();
  const startOfday = today.startOf('day').toDate(),
    endOfDay = today.endOf('day').toDate();

  const getCourseAttendanceToday = () => {
    let dates = [];

    attendanceCourseList.forEach(({ classDates, docId }) =>
      classDates.forEach(date => {
        if (date.startDate >= startOfday && date.startDate <= endOfDay)
          dates.push({ ...date, courseDocId: docId });
      })
    );

    return dates;
  };

  return (
    <Grid
      container
      direction='row'
      justify='center'
      className={classes.mainContainer}
    >
      <Grid
        container
        direction='column'
        style={{ width: matchesSM ? '95%' : '40%', marginTop: '1em' }}
      >
        <Grid item className={classes.header}>
          <Typography variant='h4'>Course List</Typography>
        </Grid>
        {getCourseAttendanceToday().length ? (
          getCourseAttendanceToday().map((course, i) => (
            <Grid item key={i}>
              <CourseCard
                course={course}
                studentId={student.id}
                studentTimestamp={student.timestamp.toDate()}
                studentUpdateAttendanceStart={studentUpdateAttendanceStart}
              />
            </Grid>
          ))
        ) : (
          <Grid item>
            <Typography variant='h6'>You have no classes to day.</Typography>
          </Grid>
        )}
      </Grid>
      <NotificationContainer status={status} />
    </Grid>
  );
};

export default Courses;
