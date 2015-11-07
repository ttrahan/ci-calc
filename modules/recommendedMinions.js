'use strict';

module.exports = function recommendedMinions(probAcceptable5MinWait,
  probAcceptable30MinWait, probTimes, results) {
  // For reference:
  // first row of probTimes contains headers for the queue wait time in minutes
  // the subsequent rows contain the number of concurrent minions available followed
  // by the probability of a build waiting for the designated wait time, e.g.
  // .26 corresponding to the 5 column means a 26% probability a build will wait
  // in the queue for at least 5 minutes before starting to process.

  const max5 = probAcceptable5MinWait;
  const max30 = probAcceptable30MinWait;
  const position5 = 2;
  const position30 = 7;

  for (let j=1; j<=probTimes.length - 1; j++) {
    let numBuildMinions = probTimes[j][0];
    let prob5 = probTimes[j][position5 - 1];
    let prob30 = probTimes[j][position30 - 1];
    if( prob5 <= max5 && prob30 <= max30) {
      let recommendedMinionCount = numBuildMinions;
      return results(null, recommendedMinionCount);
    }
  }
};
