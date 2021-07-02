import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectAttendanceCourseListForPreview,
  selectAttendanceStatus
} from '../../../redux/attendance/attendanceSelectors';
import { selectCurrentUser } from '../../../redux/user/userSelectors';

import { studentUpdateAttendanceStart } from '../../../redux/attendance/attendanceActions';

import Courses from '../../../pages/student/Courses';

const mapStateToProps = createStructuredSelector({
  attendanceCourseList: selectAttendanceCourseListForPreview,
  student: selectCurrentUser,
  status: selectAttendanceStatus
});

export default connect(mapStateToProps, { studentUpdateAttendanceStart })(
  Courses
);
