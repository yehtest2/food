const a = bc => {
  return (a, b, c) => {
    bc(a, b, c).catch(c);
  };
};

const c = a(async (a, b, c) => {
  console.log(a);
});
c(1, 2, 3);
