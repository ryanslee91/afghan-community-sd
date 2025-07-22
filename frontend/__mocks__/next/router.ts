const push = jest.fn();
module.exports = {
  useRouter: () => ({
    push,
  }),
  // 필요 시 prefetch, replace 등 추가 모킹
};