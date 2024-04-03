export const filterChangedProps = <T>(newObj: T, originalObj: T): Partial<T> => {
  const filteredObj = {} as Partial<T>;

  for (const prop in newObj) {
    if (originalObj[prop] !== newObj[prop]) filteredObj[prop] = newObj[prop];
  }

  return filteredObj;
};
