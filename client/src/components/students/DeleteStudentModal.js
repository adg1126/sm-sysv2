import React from 'react';
import history from '../../history';

import { makeStyles } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import ModalContainer from '../../containers/ModalContainer';

const useStyles = makeStyles(theme => ({
  buttonContainer: { padding: '0 1em' },
  greenButton: {
    ...theme.button,
    ...theme.buttonGreenAnimation,
    fontSize: '1em',
    marginBottom: '1.5em'
  },
  redButton: {
    ...theme.button,
    ...theme.buttonRedAnimation,
    fontSize: '1em',
    marginBottom: '1.5em'
  }
}));

const DeleteStudentModal = ({
  deleteStudentStart,
  deleteStudentFromCourseStart,
  setModalOpen,
  course,
  studentToUpdate,
  instructorId,
  instructorCourses
}) => {
  const classes = useStyles();

  const handleClick = () => {
    course && studentToUpdate && history.location.pathname !== '/students'
      ? deleteStudentFromCourseStart(studentToUpdate.docId, {
          courseDocId: course.docId,
          instructor: { instructorId, instructorCourses }
        })
      : deleteStudentStart(studentToUpdate.docId);
    setModalOpen('deleteStudent', false);
  };

  const modalContent = {
    title:
      course && studentToUpdate
        ? `Remove ${studentToUpdate.fullName} from ${course.courseCode} - ${course.courseName}`
        : 'Remove Student',
    content: course ? (
      <>
        <DialogContentText>
          This action will only delete the student from this course the student.
        </DialogContentText>
        <DialogContentText>
          To permanently delete the student delete the student. Delete the
          student from the students tab.
        </DialogContentText>
      </>
    ) : (
      <>
        <DialogContentText>
          This action will permanently delete all of this student' data.
        </DialogContentText>
        <DialogContentText>
          Including all this student's course data (attendance and grades).
        </DialogContentText>
      </>
    ),
    actions: (
      <Grid className={classes.buttonContainer} container direction='row'>
        <Grid item>
          <Button
            variant='outlined'
            className={classes.redButton}
            onClick={() => setModalOpen('deleteStudent', false)}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item style={{ marginLeft: '1em' }}>
          <Button
            variant='outlined'
            className={classes.greenButton}
            onClick={handleClick}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    )
  };

  return <ModalContainer {...modalContent} modalName='deleteStudent' />;
};

export default DeleteStudentModal;
