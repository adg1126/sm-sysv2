import _ from 'lodash';
import {
  FETCH_COURSES_START,
  FETCH_ALL_COURSES_SUCCESS,
  FETCH_COURSES_SUCCESS,
  FETCH_COURSES_FAILURE,
  ADD_COURSE_SUCCESS,
  ADD_COURSE_FAILURE,
  DELETE_COURSE_SUCCESS,
  DELETE_COURSE_FAILURE,
  EDIT_COURSE_SUCCESS,
  EDIT_COURSE_FAILURE,
  SET_CURRENT_COURSE
} from './coursesActionTypes';

const INITIAL_STATE = {
  allCourses: {},
  courseList: [],
  currentCourse: null,
  isFetching: false,
  errMessage: '',
  status: {
    success: '',
    err: ''
  }
};

const coursesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COURSES_START:
      return { ...state, isFetching: true };
    case FETCH_COURSES_SUCCESS:
      return { ...state, isFetching: false, courseList: action.payload };
    case FETCH_COURSES_FAILURE:
      return {
        ...state,
        isFetching: false,
        errMessage: action.payload
      };
    case FETCH_ALL_COURSES_SUCCESS:
      return {
        ...state,
        allCourses: action.payload
      };
    case ADD_COURSE_SUCCESS:
      return {
        ...state,
        courseList: {
          ...state.courseList,
          [action.key]: action.value
        },
        status: { success: 'Successfully added course', err: '' }
      };
    case SET_CURRENT_COURSE:
      return typeof action.payload === 'string'
        ? {
            ...state,
            currentCourse: action.payload
          }
        : {
            ...state,
            currentCourse: { ...action.payload }
          };
    case EDIT_COURSE_SUCCESS:
      return {
        ...state,
        courseList: {
          ...state.courseList,
          [action.payload.docId]: action.payload
        },
        status: { success: 'Successfully edited course', err: '' }
      };
    case DELETE_COURSE_SUCCESS:
      return {
        ...state,
        courseList: _.omit(state.courseList, action.payload),
        status: { success: 'Successfully deleted course', err: '' }
      };
    case ADD_COURSE_FAILURE || EDIT_COURSE_FAILURE || DELETE_COURSE_FAILURE:
      return {
        ...state,
        status: { success: '', err: action.payload }
      };
    default:
      return state;
  }
};

export default coursesReducer;
