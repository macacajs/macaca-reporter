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

export const addImageEvent = () => {
  document.body.addEventListener('click', e => {
    const { target } = e;
    const tagName = target.tagName.toUpperCase();

    const zoom = 0.6;
    if (tagName === 'IMAGE') {
      let index = 0;
      const items = [];
      document.querySelectorAll('image').forEach((item, key) => {
        const { width: imageWidth, height: imageHeight } = item.getBoundingClientRect();
        const ratio = (imageWidth / imageHeight).toFixed(2);
        const { width: screenWidth, height: screenHeight } = window.screen;
        if (item === target) {
          index = key;
        }
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
        const href = item.getAttribute('href');
        const titleContainer = item.parentNode.querySelector('text');
        const textArray = [].slice.call(titleContainer && titleContainer.querySelectorAll('tspan') || []);
        const title = textArray.reduce((pre, current) => { return pre + current.innerHTML; }, '');
        items.push({ src: href,
          title,
          ...pos });
      });
      openPhotoSwipe(items, index);
    } else if (tagName === 'IMG' && target.classList.contains('picture-item')) {
      const index = parseInt(target.getAttribute('data-index'), 10);
      const items = [];
      document.querySelectorAll('#display-items .display-item').forEach(item => {
        const src = item.getAttribute('src');
        const title = item.getAttribute('data-title');
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
        items.push({ src,
          title,
          ...pos });
      });
      openPhotoSwipe(items, index);
    }
  }, false);
};
