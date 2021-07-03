import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  Scheduler,
  WeekView,
  Appointments
} from '@devexpress/dx-react-scheduler-material-ui';
import ReusableCard from '../components/ReusableCard';

const useStyles = makeStyles(theme => ({
  mainContainer: { width: '100vw' },
  col: {
    width: '70%',
    [theme.breakpoints.down('md')]: { width: '90%' },
    [theme.breakpoints.down('sm')]: { width: '95%' }
  }
}));

const Schedule = ({ courseList }) => {
  const classes = useStyles();

  const startDate = moment().day(0).startOf('day').toDate(),
    endDate = moment().day(6).endOf('day').toDate();

  const getDatesForWeek = () => {
    let dates = [];

    courseList.forEach(({ classDates }) =>
      classDates.forEach(date => {
        if (date.startDate >= startDate && date.startDate <= endDate)
          dates.push(date);
      })
    );

    return dates;
  };

  const cardContent = {
    header: <Typography variant='h5'>Schedule</Typography>,
    content: (
      <Paper>
        <Scheduler data={getDatesForWeek()} height={660}>
          <WeekView startDayHour={7} endDayHour={18} />
          <Appointments />
        </Scheduler>
      </Paper>
    ),
    actions: ''
  };

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.mainContainer}
    >
      <Grid className={classes.col} container>
        <ReusableCard {...cardContent} />
      </Grid>
    </Grid>
  );
};

export default Schedule;
