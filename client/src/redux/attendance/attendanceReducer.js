import {
  FETCH_ATTENDANCE_START,
  FETCH_ATTENDANCE_SUCCESS,
  FETCH_ATTENDANCE_FAILURE,
  SET_CURRENT_COURSE,
  SET_CURRENT_DATE,
  UPDATE_COURSE_ATTENDANCE_SUCCESS,
  STUDENT_UPDATE_ATTENDANCE_START,
  INSTRUCTOR_UPDATE_ATTENDANCE_START,
  UPDATE_ATTENDANCE_SUCCESS,
  UPDATE_ATTENDANCE_FAILURE
} from './attendanceActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
  courseList: {},
  currentCourse: {},
  currentDate: {},
  isFetching: false,
  errMessage: '',
  status: {
    success: '',
    err: ''
  }
};

const attendanceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ATTENDANCE_START:
      return { ...state, isFetching: true };
    case FETCH_ATTENDANCE_SUCCESS:
      return { ...state, isFetching: false, courseList: action.payload };
    case FETCH_ATTENDANCE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errMessage: action.payload
      };
    case SET_CURRENT_COURSE:
      return {
        ...state,
        isFetching: false,
        currentCourse: Object.values(state.courseList).find(course =>
          course.courseCode.match(action.payload)
        )
      };
    case SET_CURRENT_DATE:
      return { ...state, currentDate: action.payload };
    case UPDATE_COURSE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        courseList: {
          ...state.courseList,
          [action.key]: {
            ...state.courseList[action.key],
            classDates: action.value
          }
        }
      };
    case STUDENT_UPDATE_ATTENDANCE_START:
      return {
        ...state,
        courseList: {
          ...state.courseList,
          [action.key]: {
            ...state.courseList[action.key],
            classDates: state.courseList[action.key].classDates.map(date =>
              date.id === action.value.id
                ? {
                    ...date,
                    students: date.students.map(student =>
                      student.docId === action.value.docId
                        ? action.value
                        : student
                    )
                  }
                : date
            )
          }
        }
      };
    case INSTRUCTOR_UPDATE_ATTENDANCE_START:
      return {
        ...state,
        courseList: {
          ...state.courseList,
          [action.key]: {
            ...state.courseList[action.key],
            classDates: state.courseList[action.key].classDates.map(date =>
              date.id === state.currentDate.id
                ? {
                    ...date,
                    students: !_.isEmpty(action.value)
                      ? _.compact(
                          _.flattenDeep(
                            date.students.map(({ docId, fullName }) =>
                              Object.entries(action.value).map(([k, v]) =>
                                docId === k
                                  ? {
                                      docId,
                                      fullName,
                                      attendanceStatus: v.status
                                    }
                                  : null
                              )
                            )
                          )
                        )
                      : date.students
                  }
                : date
            )
          }
        },
        currentCourse: {
          ...state.courseList[action.key],
          classDates: state.courseList[action.key].classDates.map(date =>
            date.id === state.currentDate.id
              ? {
                  ...date,
                  students: !_.isEmpty(action.value)
                    ? _.compact(
                        _.flattenDeep(
                          date.students.map(({ docId, fullName }) =>
                            Object.entries(action.value).map(([k, v]) =>
                              docId === k
                                ? {
                                    docId,
                                    fullName,
                                    attendanceStatus: v.status
                                  }
                                : null
                            )
                          )
                        )
                      )
                    : date.students
                }
              : date
          )
        }
      };
    case UPDATE_ATTENDANCE_SUCCESS:
      return { ...state, status: { success: action.payload, err: '' } };
    case UPDATE_ATTENDANCE_FAILURE:
      return { ...state, status: { success: '', err: action.payload } };
    default:
      return state;
  }
};

export default attendanceReducer;
