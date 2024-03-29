import {
  FETCH_STUDENTS_START,
  FETCH_STUDENTS_SUCCESS,
  FETCH_STUDENTS_FAILURE,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAILURE,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAILURE,
  SET_STUDENT_TO_UPDATE,
  ADD_EXISTING_STUDENT_TO_COURSE_START,
  ADD_EXISTING_STUDENT_TO_COURSE_SUCCESS,
  ADD_EXISTING_STUDENT_TO_COURSE_FAILURE,
  DELETE_STUDENT_FROM_COURSE_START,
  DELETE_STUDENT_FROM_COURSE_SUCCESS,
  DELETE_STUDENT_FROM_COURSE_FAILURE,
  EDIT_STUDENT_START,
  EDIT_STUDENT_SUCCESS,
  EDIT_STUDENT_FAILURE
} from './studentActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
  studentList: [],
  studentToUpdate: null,
  isFetching: false,
  errMessage: '',
  status: {
    success: '',
    err: ''
  }
};

let key, courseDocId, currentUserDocId, instructorId, instructorCourses;

const studentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_STUDENTS_START:
      return { ...state, isFetching: true };
    case FETCH_STUDENTS_SUCCESS:
      return { ...state, isFetching: false, studentList: action.payload };
    case FETCH_STUDENTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errMessage: action.payload
      };
    case ADD_STUDENT_SUCCESS:
      return {
        ...state,
        studentList: {
          ...state.studentList,
          [action.payload.docId]: action.payload
        },
        status: { success: 'Successfully added student', err: '' }
      };
    case DELETE_STUDENT_SUCCESS:
      return {
        ...state,
        studentList: _.omit(state.studentList, action.payload),
        status: { success: 'Successfully deleted student', err: '' }
      };
    case ADD_STUDENT_FAILURE || DELETE_STUDENT_FAILURE:
      return {
        ...state,
        status: { success: '', err: action.payload }
      };
    case SET_STUDENT_TO_UPDATE:
      return {
        ...state,
        studentToUpdate: { ...state.studentToUpdate, ...action.payload }
      };
    case ADD_EXISTING_STUDENT_TO_COURSE_START:
      ({
        key,
        value: { courseDocId, currentUserDocId }
      } = action);

      return {
        ...state,
        studentList: {
          ...state.studentList,
          [key]: {
            ...state.studentList[key],
            instructors: state.studentList[key].instructors.includes(
              currentUserDocId
            )
              ? state.studentList[key].instructors
              : _.concat(state.studentList[key].instructors, currentUserDocId),
            courses: _.concat(state.studentList[key].courses, courseDocId)
          }
        }
      };
    case ADD_EXISTING_STUDENT_TO_COURSE_SUCCESS:
      return {
        ...state,
        status: { success: action.payload, err: '' }
      };
    case ADD_EXISTING_STUDENT_TO_COURSE_FAILURE:
      return {
        ...state,
        status: { success: '', err: action.payload }
      };
    case DELETE_STUDENT_FROM_COURSE_START:
      ({
        key,
        value: {
          courseDocId,
          instructor: { instructorId, instructorCourses }
        }
      } = action);

      let updatedCourses = _.without(
        state.studentList[key].courses,
        courseDocId
      );

      return {
        ...state,
        studentList: {
          ...state.studentList,
          [key]: {
            ...state.studentList[key],
            instructors: _.intersection(updatedCourses, instructorCourses)
              .length
              ? state.studentList[key].instructors
              : _.without(state.studentList[key].instructor, instructorId),
            courses: updatedCourses
          }
        }
      };
    case DELETE_STUDENT_FROM_COURSE_SUCCESS:
      return {
        ...state,
        status: {
          success: action.payload,
          err: ''
        }
      };
    case DELETE_STUDENT_FROM_COURSE_FAILURE:
      return {
        ...state,
        status: { success: '', err: action.payload }
      };
    case EDIT_STUDENT_START:
      return {
        ...state,
        studentList: {
          ...state.studentList,
          [action.key]: { ...state.studentList[action.key], ...action.value }
        }
      };
    case EDIT_STUDENT_SUCCESS:
      return {
        ...state,
        status: { success: action.payload, err: '' }
      };
    case EDIT_STUDENT_FAILURE:
      return {
        ...state,
        status: { success: '', err: action.payload }
      };
    default:
      return state;
  }
};

export default studentReducer;
