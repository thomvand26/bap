export * from './authUtils';
export * from './chatUtils';
export * from './chatroomUtils';
export * from './dbUtils';
export * from './showUtils';
export * from './songRequestUtils';

export const removeUndefinedFromObject = (object) => {
  const cleanObject = { ...object };
  Object.keys(cleanObject).forEach(
    (key) => cleanObject[key] === undefined && delete cleanObject[key]
  );
  return cleanObject;
};

export const parseObjectStrings = (object) => {
  const parsedObject = { ...object };
  Object.keys(parsedObject).forEach(
    (key) =>
      (parsedObject[key] = parsedObject[key].startsWith('{')
        ? JSON.parse(parsedObject[key])
        : parsedObject[key])
  );
  return parsedObject;
};
