import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentUser,
  selectCurrentUserType
} from '../redux/user/userSelectors';

import { checkUserSession } from '../redux/user/userActions';
import {
  fetchCoursesStart,
  fetchAllCoursesStart
} from '../redux/courses/coursesActions';
import { fetchStudentsStart } from '../redux/student/studentActions';
import { fetchAttendanceStart } from '../redux/attendance/attendanceActions';

import App from '../components/App';

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  currentUserType: selectCurrentUserType
});

export default connect(mapStateToProps, {
  checkUserSession,
  fetchAllCoursesStart,
  fetchCoursesStart,
  fetchStudentsStart,
  fetchAttendanceStart
})(App);
