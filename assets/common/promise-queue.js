const noop = () => {};
const resolveWith = e => {
  return new Promise(resolve => {
    // eslint-disable-next-line no-promise-executor-return
    return resolve(e);
  });
};

/**
 * @param {Number} max number of concurrently executed promises
 * @param {Number} max number of queued promises
 * @function Object() { [native code] }
 */
function PromiseQueue(maxPendingPromises, maxQueuedPromises, options = {}) {
  this.options = options;
  this.pendingPromises = 0;
  this.maxPendingPromises = typeof maxPendingPromises !== 'undefined' ? maxPendingPromises : Infinity;
  this.maxQueuedPromises = typeof maxQueuedPromises !== 'undefined' ? maxQueuedPromises : Infinity;
  this.queue = [];
}

/**
 * @param {Function} promiseGenerator
 * @return {Promise}
 */
PromiseQueue.prototype.add = function (promiseGenerator) {
  return new Promise((resolve, reject, notify) => {
    if (this.queue.length >= this.maxQueuedPromises) {
      reject(new Error('Queue limit reached'));
      return;
    }
    this.queue.push({
      promiseGenerator,
      resolve,
      reject,
      notify: notify || noop,
    });
    this._dequeue();
  });
};

/**
 * Number of simultaneously running promises (which are resolving)
 * @return {number}
 */
PromiseQueue.prototype.getPendingLength = function () {
  return this.pendingPromises;
};

PromiseQueue.prototype.clear = function () {
  this.queue = [];
  this.pendingPromises = 0;
};

/**
 * Number of queued promises (which are waiting)
 * @return {number}
 */
PromiseQueue.prototype.getQueueLength = function () {
  return this.queue.length;
};

/**
 * @return {boolean} true if first item removed from queue
 */
PromiseQueue.prototype._dequeue = function () {
  if (this.pendingPromises >= this.maxPendingPromises) {
    return false;
  }

  const item = this.queue.shift();
  if (!item) {
    if (this.options.onEmpty) {
      this.options.onEmpty();
    }
    return false;
  }

  try {
    this.pendingPromises++;

    resolveWith(item.promiseGenerator())
      .then(value => {
        this.pendingPromises--;
        item.resolve(value);
        this._dequeue();
      }, err => {
        this.pendingPromises--;
        item.reject(err);
        this._dequeue();
      }, message => {
        item.notify(message);
      });
  } catch (err) {
    this.pendingPromises--;
    item.reject(err);
    this._dequeue();
  }
  return true;
};

export default PromiseQueue;
