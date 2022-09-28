export const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

export const autoWrapText = text => {
  let res = '';
  const number = 15;
  let flag = 0;

  for (let i = 0; i < text.length; i++) {
    const current = text[i];
    res += current;
    flag++;
    if (escape(current).length > 4) {
      flag++;
    }

    if (flag >= number) {
      res += '\n';
      flag = 0;
    }
  }
  return res;
};

export const validVideo = (file) => {
  return file.includes('.webm') || file.includes('.mp4');
};

export const validImage = (file) => {
  return file.includes('.png') || file.includes('.jpg') || file.includes('.gif');
};

export const formatSeconds = (value) => {
  if (!value || typeof value !== 'number' || value < 1) {
    console.warn('can not format seconds', value);
    return '0s';
  }
  const secondTime = Math.ceil(value / 1000);

  let seconds = secondTime;
  let minutes = 0;
  let hour = 0;

  if (seconds > 60) {
    minutes = parseInt(seconds / 60, 10);
    seconds = parseInt(seconds % 60, 10);
    if (minutes > 60) {
      hour = parseInt(minutes / 60, 10);
      minutes = parseInt(minutes % 60, 10);
    }
  }

  let finalTime = `${seconds}s`;
  if (minutes > 0) {
    finalTime = `${minutes}m ${finalTime}`;
    if (hour > 0) {
      finalTime = `${hour}h ${finalTime}`;
    }
  }
  return finalTime;
};
