import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import { firestore } from '../../config/firebase';
import _ from 'lodash';

import {
  FETCH_ATTENDANCE_START,
  FETCH_ATTENDANCE_SUCCESS,
  ADD_COURSE_ATTENDANCE_SUCCESS,
  DELETE_COURSE_ATTENDANCE_SUCCESS,
  STUDENT_UPDATE_ATTENDANCE_START,
  INSTRUCTOR_UPDATE_ATTENDANCE_START,
  UPDATE_ATTENDANCE_SUCCESS
} from './attendanceActionTypes';
import {
  ADD_COURSE_SUCCESS,
  DELETE_COURSE_START,
  EDIT_COURSE_SUCCESS,
  FETCH_COURSES_SUCCESS
} from '../courses/coursesActionTypes';
import {
  ADD_STUDENT_SUCCESS,
  FETCH_STUDENTS_SUCCESS,
  ADD_EXISTING_STUDENT_TO_COURSE_SUCCESS,
  DELETE_STUDENT_FROM_COURSE_SUCCESS,
  EDIT_STUDENT_SUCCESS
} from '../student/studentActionTypes';
import {
  fetchAttendanceSuccesss,
  fetchAttendanceFailure,
  addCourseAttendanceSuccess,
  deleteCourseAttendanceSuccess,
  updateCourseAttendanceSuccess,
  updateAttendanceSuccess,
  updateAttendanceFailure
} from './attendanceActions';

import { selectCurrentUser } from '../user/userSelectors';
import {
  selectCourseListForPreview,
  selectAllCoursesForPreview
} from '../courses/coursesSelectors';
import { selectStudentListForPreview } from '../student/studentSelectors';
import {
  selectAttendanceCourseListForPreview,
  selectCourse
} from '../attendance/attendanceSelectors';

import {
  convertAttendanceSnapshotToMap,
  getClassDates
} from './attendanceUtils';

export function* fetchAttendanceAsync() {
  const currentUser = yield select(selectCurrentUser),
    student = yield select(selectStudentListForPreview);

  const attendanceRef =
    currentUser.userType !== 'Instructor' && !_.isEmpty(student[0])
      ? firestore
          .collection('attendance')
          .where('courseId', 'in', student[0].courses)
      : firestore
          .collection('attendance')
          .where('instructorId', '==', currentUser.id);

  try {
    const snapshot = yield attendanceRef.get();
    const attendanceRefMap = yield call(
      convertAttendanceSnapshotToMap,
      snapshot
    );
    yield put(fetchAttendanceSuccesss(attendanceRefMap));
  } catch (err) {
    yield put(fetchAttendanceFailure(err.message));
  }
}

export function* fetchAttendanceStart() {
  yield takeLatest(
    [
      FETCH_ATTENDANCE_START,
      ADD_COURSE_ATTENDANCE_SUCCESS,
      DELETE_COURSE_ATTENDANCE_SUCCESS,
      FETCH_STUDENTS_SUCCESS
    ],
    fetchAttendanceAsync
  );
}

export function* addAttendanceInFirebase() {
  const currentUser = yield select(selectCurrentUser);
  const attendanceRef = firestore.collection('attendance');
  const courseList = yield select(selectCourseListForPreview);
  const studentList = yield select(selectStudentListForPreview);

  if (currentUser && courseList.length && studentList.length) {
    for (let course of courseList) {
      let courseAttendanceSnapshot = yield attendanceRef
        .where('courseId', '==', course.docId)
        .get();

      const courseStudents = _.compact(
        studentList.map(student =>
          student.courses.includes(course.docId)
            ? {
                ..._.pick(student, ['docId', 'fullName']),
                attendanceStatus: ''
              }
            : null
        )
      );

      const newDates = getClassDates(
        course.courseDates.startDate,
        course.courseDates.endDate,
        course.daysMeetAndTime,
        course.courseCode,
        courseStudents
      );

      if (courseAttendanceSnapshot.empty) {
        try {
          yield attendanceRef.add({
            classDates: newDates,
            instructorId: currentUser.id,
            courseId: course.docId,
            courseCode: course.courseCode
          });

          yield put(addCourseAttendanceSuccess());
        } catch (err) {}
      }
    }
  }
}

export function* onAddAttendanceInFireBase() {
  yield takeLatest(
    [FETCH_COURSES_SUCCESS, ADD_COURSE_SUCCESS, FETCH_STUDENTS_SUCCESS],
    addAttendanceInFirebase
  );
}

export function* updateAttendanceInFirebase() {
  const currentUser = yield select(selectCurrentUser);
  const attendanceRef = firestore
    .collection('attendance')
    .where('instructorId', '==', currentUser.id);
  const courseList = yield select(selectCourseListForPreview);
  const studentList = yield select(selectStudentListForPreview);
  const attendanceCourseList = yield select(
    selectAttendanceCourseListForPreview
  );

  if (
    currentUser &&
    courseList.length &&
    attendanceCourseList.length &&
    studentList.length
  ) {
    for (let course of courseList) {
      let courseAttendanceSnapshot = yield attendanceRef
        .where('courseId', '==', course.docId)
        .get();

      const courseStudents = _.compact(
        studentList.map(student =>
          student.courses.includes(course.docId)
            ? {
                ..._.pick(student, ['docId', 'fullName']),
                attendanceStatus: ''
              }
            : null
        )
      );

      const newDates = getClassDates(
        course.courseDates.startDate,
        course.courseDates.endDate,
        course.daysMeetAndTime,
        course.courseCode,
        courseStudents
      );

      if (!courseAttendanceSnapshot.empty) {
        for (let courseAttendance of attendanceCourseList) {
          if (courseAttendance.courseId.includes(course.docId)) {
            let newClassDates;

            newClassDates = newDates.reduce((res, newDate) => {
              return courseAttendance.classDates.some(
                courseAttendanceDate =>
                  newDate.startDate.toString() ===
                  courseAttendanceDate.startDate.toString()
              )
                ? courseAttendance.classDates.some(courseAttendanceDate =>
                    newDate.students.every(student =>
                      courseAttendanceDate.students.includes(student.docId)
                    )
                  )
                  ? res
                  : courseAttendance.classDates.map(courseAttendanceDate => {
                      let newStudents = _.flattenDeep(
                        newDate.students.map(newDateStudent => [
                          ...courseAttendanceDate.students.filter(
                            resStudent =>
                              newDateStudent.docId === resStudent.docId
                          ),
                          newDateStudent
                        ])
                      );
                      return {
                        ...courseAttendanceDate,
                        students: _.uniqWith(newStudents, (x, y) =>
                          _.isEqual(x.docId, y.docId)
                            ? !x.attendanceStatus.length ||
                              !y.attendanceStatus.length
                            : null
                        )
                      };
                    })
                : [...res, newDate];
            }, courseAttendance.classDates);

            try {
              yield courseAttendanceSnapshot.forEach(async doc => {
                await doc.ref.update({
                  classDates: newClassDates.filter(ncDate =>
                    newDates.some(
                      nDate =>
                        ncDate.startDate.toString() ===
                        nDate.startDate.toString()
                    )
                  )
                });
              });

              yield put(
                updateCourseAttendanceSuccess(
                  courseAttendance.docId,
                  newClassDates.filter(ncDate =>
                    newDates.some(
                      nDate =>
                        ncDate.startDate.toString() ===
                        nDate.startDate.toString()
                    )
                  )
                )
              );
            } catch (err) {}
          }
        }
      }
    }
  }
}

export function* onUpdateAttendanceInFirebase() {
  yield takeLatest(
    [
      FETCH_COURSES_SUCCESS,
      ADD_COURSE_SUCCESS,
      EDIT_COURSE_SUCCESS,
      FETCH_STUDENTS_SUCCESS,
      ADD_STUDENT_SUCCESS,
      ADD_EXISTING_STUDENT_TO_COURSE_SUCCESS,
      DELETE_STUDENT_FROM_COURSE_SUCCESS,
      EDIT_STUDENT_SUCCESS,
      FETCH_ATTENDANCE_SUCCESS,
      UPDATE_ATTENDANCE_SUCCESS
    ],
    updateAttendanceInFirebase
  );
}

export function* deleteAttendanceInFirebase() {
  const currentUser = yield select(selectCurrentUser);
  const attendanceRef = firestore.collection('attendance');
  const attendanceRefSnapshot = yield attendanceRef.get();
  const attendanceCourseList = yield select(
    selectAttendanceCourseListForPreview
  );
  const courseList = yield select(selectAllCoursesForPreview);

  if (
    currentUser &&
    !_.isEmpty(attendanceCourseList) &&
    !_.isEmpty(courseList)
  ) {
    try {
      const coursesToDelete = attendanceCourseList.filter(
        ({ courseId }) => !Object.keys(courseList).some(k => k === courseId)
      );

      if (coursesToDelete.length) {
        yield attendanceRefSnapshot.forEach(async doc => {
          const { courseId } = doc.data();

          courseList.forEach(({ docId }) => {
            if (docId !== courseId) doc.ref.delete();
          });
        });
        yield put(deleteCourseAttendanceSuccess());
      }
    } catch (err) {}
  }
}

export function* onDeleteAttendanceInFirebase() {
  yield takeLatest([DELETE_COURSE_START], deleteAttendanceInFirebase);
}

export function* updateStudentAttendanceInFirebase({ key: courseDocId }) {
  const currentUser = yield select(selectCurrentUser);
  if (currentUser) {
    try {
      const course = yield select(selectCourse(courseDocId));
      const attendanceForCourseRef = firestore
        .collection('attendance')
        .doc(courseDocId);
      yield attendanceForCourseRef.update(_.omit(course, 'docId'));
      yield put(updateAttendanceSuccess('Successfully updated attendance.'));
    } catch (err) {
      yield put(updateAttendanceFailure('Failed to updated attendance.'));
    }
  }
}

export function* onUpdateStudentAttendanceInFirebase() {
  yield takeLatest(
    [INSTRUCTOR_UPDATE_ATTENDANCE_START, STUDENT_UPDATE_ATTENDANCE_START],
    updateStudentAttendanceInFirebase
  );
}

export function* attendanceSagas() {
  yield all([
    call(fetchAttendanceStart),
    call(onAddAttendanceInFireBase),
    call(onUpdateAttendanceInFirebase),
    call(onDeleteAttendanceInFirebase),
    call(onUpdateStudentAttendanceInFirebase)
  ]);
}
