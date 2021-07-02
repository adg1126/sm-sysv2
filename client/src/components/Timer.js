import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';

const Timer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  function calculateTimeLeft() {
    let difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  return !_.isEmpty(timeLeft) ? (
    <Typography variant='body1'>{`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</Typography>
  ) : null;
};

export default Timer;
