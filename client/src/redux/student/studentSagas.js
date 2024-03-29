import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import _ from 'lodash';
import {
  FETCH_STUDENTS_START,
  ADD_STUDENT_START,
  DELETE_STUDENT_START,
  ADD_EXISTING_STUDENT_TO_COURSE_START,
  DELETE_STUDENT_FROM_COURSE_START,
  EDIT_STUDENT_START
} from './studentActionTypes';
import {
  fetchStudentsSuccess,
  fetchStudentsFailure,
  addStudentSuccess,
  addStudentFailure,
  deleteStudentSuccess,
  deleteStudentFailure,
  addExistingStudentToCourseSuccess,
  addExistingStudentToCourseFailure,
  deleteStudentFromCourseSuccess,
  deleteStudentFromCourseFailure,
  editStudentFailure,
  editStudentSuccess
} from './studentActions';
import { firestore } from '../../config/firebase';
import { convertStudentsSnapshotToMap } from './studentUtils';
import { selectCurrentUser } from '../user/userSelectors';
import { selectStudent } from './studentSelectors';

export function* fetchStudentsAsync() {
  const currentUser = yield select(selectCurrentUser);

  const studentsRef =
    currentUser.userType !== 'Instructor'
      ? firestore.collection('students').where('email', '==', currentUser.email)
      : firestore.collection('students');

  if (currentUser) {
    try {
      const snapshot = yield studentsRef.get();
      const studentsMap = yield call(convertStudentsSnapshotToMap, snapshot);
      yield put(fetchStudentsSuccess(studentsMap));
    } catch (err) {
      yield put(
        fetchStudentsFailure(
          'Failed to fetch students, check your internet connection.'
        )
      );
    }
  }
}

export function* fetchStudentsStart() {
  yield takeLatest(FETCH_STUDENTS_START, fetchStudentsAsync);
}

export function* addStudentToFirebase({ payload: studentData }) {
  const currentUser = yield select(selectCurrentUser);
  const studentsRef = firestore.collection('students');
  const studentRef = studentsRef.where('idNumber', '==', studentData.idNumber);
  const studentRefSnapshot = yield studentRef.get();

  if (currentUser) {
    try {
      if (studentRefSnapshot.empty) {
        const studentDocRef = yield studentsRef.add({
          ...studentData,
          instructors: [currentUser.id]
        });
        yield put(
          addStudentSuccess({
            instructors: [currentUser.id],
            docId: studentDocRef.id,
            ...studentData
          })
        );
      } else {
        yield put(addStudentFailure('This studdent already exists.'));
      }
    } catch (err) {
      yield put(
        addStudentFailure(
          'Failed to add student, check your internet connection.'
        )
      );
    }
  }
}

export function* onStudentAdd() {
  yield takeLatest(ADD_STUDENT_START, addStudentToFirebase);
}

export function* deleteStudentInFirebase({ payload: studentDocId }) {
  const currentUser = yield select(selectCurrentUser);
  const studentToDeleteRef = firestore.collection('students').doc(studentDocId);

  if (currentUser) {
    try {
      const snapshot = yield studentToDeleteRef.get();
      if (snapshot.empty) {
        yield put(
          deleteStudentFailure(
            'Failed to delete student, check your internet connection.'
          )
        );
      }

      yield studentToDeleteRef.delete();
      yield put(deleteStudentSuccess(studentDocId));
    } catch (err) {
      yield put(deleteStudentFailure(err.message));
    }
  }
}

export function* onStudentDelete() {
  yield takeLatest(DELETE_STUDENT_START, deleteStudentInFirebase);
}

export function* updateStudentInFirebase({ type, key: studentDocId }) {
  const currentUser = yield select(selectCurrentUser);

  if (currentUser) {
    try {
      const studentRef = yield firestore
        .collection('students')
        .doc(studentDocId);

      const student = yield select(selectStudent(studentDocId));
      yield studentRef.update(_.omit(student, 'docId'));

      type === ADD_EXISTING_STUDENT_TO_COURSE_START
        ? yield put(
            addExistingStudentToCourseSuccess(
              'Successfully added student to course'
            )
          )
        : type === DELETE_STUDENT_FROM_COURSE_START
        ? yield put(
            deleteStudentFromCourseSuccess(
              'Successfully deleted student from course'
            )
          )
        : yield put(editStudentSuccess('Successfully edited student'));
    } catch (err) {
      type === ADD_EXISTING_STUDENT_TO_COURSE_START
        ? yield put(
            addExistingStudentToCourseFailure('Failed to add student to course')
          )
        : type === DELETE_STUDENT_FROM_COURSE_START
        ? yield put(
            deleteStudentFromCourseFailure(
              'Failed to delete student from course'
            )
          )
        : yield put(editStudentFailure('Failed to edit student information'));
    }
  }
}

export function* onStudentChange() {
  yield takeLatest(
    [
      ADD_EXISTING_STUDENT_TO_COURSE_START,
      DELETE_STUDENT_FROM_COURSE_START,
      EDIT_STUDENT_START
    ],
    updateStudentInFirebase
  );
}

export function* studentSagas() {
  yield all([
    call(fetchStudentsStart),
    call(onStudentAdd),
    call(onStudentDelete),
    call(onStudentChange)
  ]);
}
