// 获取时段 温馨提示
export const getTtimeSlot = () => {
  let slot = '';
  const now = new Date();
  const hour = now.getHours();
  if (hour < 6) {
    slot = '凌晨好！';
  }
  if (hour < 9) {
    slot = '早上好！';
  } else if (hour < 12) {
    slot = '上午好！';
  } else if (hour < 14) {
    slot = '中午好！';
  } else if (hour < 17) {
    slot = '下午好！';
  } else if (hour < 19) {
    slot = '傍晚好！';
  } else if (hour < 22) {
    slot = '晚上好！';
  } else {
    slot = '夜里好！';
  }
  return slot;
};
