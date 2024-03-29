import React from 'react';
import history from '../history';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PersonAddIcon from '@material-ui/icons/PersonAdd';

import AddStudentModalContainer from '../containers/students/AddStudentModalContainer';
import StudentListTableContainer from '../containers/students/StudentListTableContainer';
import CourseInfoContainer from '../containers/courses/CourseInfoContainer';
import NotificationContainer from '../containers/NotificationContainer';
import ReusableBreadcrumbs from '../components/ReusableBreadcrumbs';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '100vw'
  },
  greenButton: {
    ...theme.button,
    ...theme.buttonGreenAnimation,
    fontSize: '1em',
    marginTop: '4em',
    [theme.breakpoints.down('xs')]: { marginTop: '2em' }
  },
  breadcrumbsContainer: { margin: '1em 0' },
  link: {
    display: 'flex',
    cursor: 'pointer',
    '&:hover': { color: 'blue' }
  }
}));

const CourseShow = ({ course, status, setModalOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));

  return course ? (
    <Grid
      container
      direction='row'
      justify='center'
      className={classes.mainContainer}
    >
      <Grid container direction='column' style={{ width: '95%' }}>
        <Grid item>
          <Typography variant='h5'>{`${course.courseCode} - ${course.courseName}`}</Typography>
        </Grid>
        <Grid item className={classes.breadcrumbsContainer}>
          <ReusableBreadcrumbs
            routesArr={[
              { route: '/courses', name: 'Courses' },
              {
                route: history.location.pathname,
                name: `${course.courseCode} - ${course.courseName}`
              }
            ]}
          />
        </Grid>
        <Grid item>
          <AddStudentModalContainer />
          <Button
            variant='outlined'
            className={classes.greenButton}
            startIcon={<PersonAddIcon />}
            onClick={() => setModalOpen('addStudent', true)}
          >
            Add Student
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        container
        style={{ width: '95%', marginTop: '1em' }}
        spacing={4}
      >
        <Grid item style={{ width: matchesSM ? '100%' : '60%' }}>
          <StudentListTableContainer />
        </Grid>
        <Grid item style={{ width: matchesSM ? '100%' : '40%' }}>
          <CourseInfoContainer />
        </Grid>
      </Grid>
      <NotificationContainer status={status} />
    </Grid>
  ) : null;
};

export default CourseShow;
