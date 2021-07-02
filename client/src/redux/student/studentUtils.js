import _ from 'lodash';

export const convertStudentsSnapshotToMap = student => {
  const transformedCollection = student.docs.map(doc => ({
    docId: doc.id,
    ...doc.data()
  }));

  return _.mapKeys(transformedCollection, 'docId');
};
