'use strict';

module.exports = function queueInfinite(lambda, mu, s, avgNumWaiting) {
  let r = lambda / mu;
  let rho = r / s;
  let term = (1 - rho) / rho;
  let queue = term;
  for (let i=1; i<=(s-1); i++) {
    term = term * (s - i) / r;
    queue = queue + term;
  }
  let numWaiting = (rho / (1 - rho)) / (1 + queue);
  return avgNumWaiting(null, numWaiting);
};
