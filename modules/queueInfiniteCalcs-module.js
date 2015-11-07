'use strict';

const roundNum = require('./roundNum-module.js');

module.exports = function queueInfinite(lambda, mu, s, results) {
  const resultsInfiniteAll = [];  // result array of all queue calcs for all build counts
  const header = ['numMinions', 'avgNumWaiting', 'avgWaitDuration', 'avgMinionUtilization'];
  resultsInfiniteAll.push(header);

  for (let j=1; j<=s; j++) {
    const resultsInfiniteNumMinions = [];  // result array for queue calcs for specific build count
    let r = lambda / mu;
    let rho = r / j;
    let term = (1 - rho) / rho;
    let queue = term;
    for (let i=1; i<=(j-1); i++) {
      term = term * (j - i) / r;
      queue = queue + term;
    }
    let avgNumWaiting = (rho / (1 - rho)) / (1 + queue);  // in builds
    let avgWaitDuration = (avgNumWaiting / lambda) * 60;  // in minutes
    let avgMinionUtilization = (lambda / (mu * j));

    resultsInfiniteNumMinions[0] = Number(j);  // number of build minions
    if (avgNumWaiting < 0 || avgWaitDuration < 0.01) {  // 0.01 minutes = 36 seconds
      continue;
    } else {
    resultsInfiniteNumMinions[1] = roundNum(avgNumWaiting, 3);
    resultsInfiniteNumMinions[2] = roundNum(avgWaitDuration, 3);
    resultsInfiniteNumMinions[3] = roundNum(avgMinionUtilization, 3);
    }

    resultsInfiniteAll.push(resultsInfiniteNumMinions);
  }
  return results(null, resultsInfiniteAll);
};

// function roundNum(num, digits) {
//     return +(Math.round(num + 'e+'+digits)  + 'e-'+digits);
// }
