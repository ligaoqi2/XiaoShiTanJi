export const extractValue = (arr, key) => {
  const res = [];
  arr.forEach((element) => {
    res.push(element[key]);
  });
  return res;
};
