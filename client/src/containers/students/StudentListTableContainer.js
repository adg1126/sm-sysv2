import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  selectStudentListForPreview,
  selectStudentsForClass,
  selectIsStudentsFetching,
  selectStudentsErrMessage
} from '../../redux/student/studentSelectors';
import { setStudentToUpdate } from '../../redux/student/studentActions';
import { setModalOpen } from '../../redux/modal/modalActions';
import history from '../../history';

import StudentListTable from '../../components/students/StudentListTable';
import WithSpinner from '../WithSpinner';

const mapStateToProps = state => {
  const path = history.location.pathname;
  const classId = path.substring(path.lastIndexOf('/') + 1);

  return {
    studentList:
      path !== '/students'
        ? selectStudentsForClass(classId)(state)
        : selectStudentListForPreview(state),
    isFetching: selectIsStudentsFetching(state),
    errMessage: selectStudentsErrMessage(state)
  };
};

export default compose(
  connect(mapStateToProps, { setModalOpen, setStudentToUpdate }),
  WithSpinner
)(StudentListTable);
