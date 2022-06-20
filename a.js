const a = [1, 2, 3];
const b = function (f) {
  const s = 8;
  if (f === 2) {
    return s;
  }
  console.log('s');
  return f * 3;
};
const c = b(2);
console.log(c);
