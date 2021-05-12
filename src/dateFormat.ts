export const getDiff = (past: Date) => {
  const time = new Date(Date.now()).getTime() - new Date(past).getTime();
  const sec = Math.ceil(time / 1000);
  let calc;

  if (sec < 60) return `${sec}초 전`;
  calc = Math.ceil(sec / 60);
  if (calc < 60) return `${calc}분 전`;
  calc = Math.ceil(sec / (60 * 60));
  if (calc < 24) return `${calc}시간 전`;
  calc = Math.ceil(sec / (60 * 60 * 24));
  return `${calc}일 전`;
};
