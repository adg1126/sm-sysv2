import { connect } from 'react-redux';
import {
  deleteStudentStart,
  deleteStudentFromCourseStart
} from '../../redux/student/studentActions';
import DeleteStudentModal from '../../components/students/DeleteStudentModal';
import { setModalOpen } from '../../redux/modal/modalActions';

import {
  selectCourse,
  selectInstructorCourses
} from '../../redux/courses/coursesSelectors';
import { selectStudentToUpdate } from '../../redux/student/studentSelectors';
import { selectCurrentUser } from '../../redux/user/userSelectors';

import history from '../../history';

const mapStateToProps = state => {
  const path = history.location.pathname;
  const classId = path.substring(path.lastIndexOf('/') + 1),
    instructorId = selectCurrentUser(state).id;

  return {
    course: path !== '/students' ? selectCourse(classId)(state) : null,
    studentToUpdate: selectStudentToUpdate(state),
    instructorId,
    instructorCourses: selectInstructorCourses(instructorId)(state)
  };
};

export default connect(mapStateToProps, {
  deleteStudentStart,
  deleteStudentFromCourseStart,
  setModalOpen
})(DeleteStudentModal);
