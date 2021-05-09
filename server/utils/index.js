export * from './authUtils';
export * from './dbUtils';
export * from './showUtils';

export const removeUndefinedFromObject = (object) => {
  const cleanObject = {...object}
  Object.keys(cleanObject).forEach(key => cleanObject[key] === undefined && delete cleanObject[key])
  return cleanObject;
}