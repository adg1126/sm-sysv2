import { createSelector } from 'reselect';
import _ from 'lodash';

const selectCourses = state => state.courses;

export const selecAllCourses = createSelector(
  [selectCourses],
  courses => courses.allCourses
);

export const selectAllCoursesForPreview = createSelector(
  [selecAllCourses],
  allCourses =>
    allCourses ? Object.keys(allCourses).map(key => allCourses[key]) : []
);

export const selectCourseList = createSelector(
  [selectCourses],
  courses => courses.courseList
);

export const selectCourseListForPreview = createSelector(
  [selectCourseList],
  courseList =>
    courseList ? Object.keys(courseList).map(key => courseList[key]) : []
);

export const selectCourse = courseId =>
  createSelector([selectCourseList], courses =>
    courses ? courses[courseId] : null
  );

export const selectIsCoursesFetching = createSelector(
  [selectCourses],
  courses => courses.isFetching
);

export const selectCoursesErrMessage = createSelector(
  [selectCourses],
  courses => courses.errMessage
);

export const selectCoursesStatus = createSelector(
  [selectCourses],
  courses => courses.status
);

export const selectCurrentCourse = createSelector(
  [selectCourses],
  courses => courses.currentCourse
);

export const selectInstructorCourses = instructorId =>
  createSelector([selectCourseListForPreview], courseList =>
    _.compact(
      courseList.map(course =>
        course.instructorId === instructorId ? course.docId : null
      )
    )
  );
