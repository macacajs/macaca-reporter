import PromiseQueue from '@/common/promise-queue';
import { openPhotoSwipe } from '../components/PhotoSwipe';

export const startsVideoPreload = () => {
  window._promiseQueue = window._promiseQueue || new PromiseQueue(3);
  const videos = document.querySelectorAll('video[preload]');
  videos.forEach(video => {
    window._promiseQueue.add(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          video.removeAttribute('preload');
          resolve();
        }, 500);
      });
    });
  });
};

function buildImgItemData(item, src, title) {
  const zoom = 0.6;
  const { width: imageWidth, height: imageHeight } = item.getBoundingClientRect();
  const ratio = (imageWidth / imageHeight).toFixed(2);
  const { width: screenWidth, height: screenHeight } = window.screen;
  let pos = {};
  // horizontal
  if (ratio > 1) {
    pos = {
      w: screenWidth * zoom,
      h: screenWidth * zoom / ratio,
    };
  } else {
    pos = {
      w: screenHeight * zoom * ratio,
      h: screenHeight * zoom,
    };
  }
  return {
    src,
    title,
    ...pos,
  };
}

export const addImageEvent = () => {
  document.body.addEventListener('click', e => {
    const { target } = e;
    const tagName = target.tagName.toUpperCase();

    if (tagName === 'IMAGE') {
      let index = 0;
      const items = [];
      document.querySelectorAll('image').forEach((item, key) => {
        if (item === target) {
          index = key;
        }
        const src = item.getAttribute('href');
        const titleContainer = item.parentNode.querySelector('text');
        const textArray = [].slice.call(titleContainer && titleContainer.querySelectorAll('tspan') || []);
        const title = textArray.reduce((pre, current) => { return pre + current.innerHTML; }, '');
        items.push(buildImgItemData(item, src, title));
      });
      openPhotoSwipe(items, index);
    } else if (tagName === 'IMG') {
      if (target.classList.contains('picture-item')) {
        const index = parseInt(target.getAttribute('data-index'), 10);
        const items = [];
        document.querySelectorAll('#display-items .display-item').forEach(item => {
          const src = item.getAttribute('src');
          const title = item.getAttribute('data-title');
          items.push(buildImgItemData(item, src, title));
        });
        openPhotoSwipe(items, index);
      } else if (target.classList.contains('picture-item-single')) {
        const index = parseInt(target.getAttribute('data-index'), 10);
        const item = target;
        const src = item.getAttribute('src');
        const title = item.getAttribute('data-title');
        const items = [
          buildImgItemData(item, src, title),
        ];
        openPhotoSwipe(items, index);
      }
    }
  }, false);
};
