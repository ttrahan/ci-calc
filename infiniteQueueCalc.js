'use strict';

const queueInfinite = require('./modules/queueInfiniteCalcs-module.js');
const expectedWaitTimes = require('./modules/expectedWaitTimes-module.js');
const writeToFile = require('./modules/writeToFile-module.js');
const recommendedMinions = require('./modules/recommendedMinions.js');

// user must provide 7 command line arguments:
// 1: number of developers
// 2: number of builds each developer builds per shift
// 3: the duration of the average build in their organization
// 4: the number of developer shifts, i.e. when groups of devs are concurrently working
// 5: the total number of concurrent build containers to evaluate results for
// 6: the acceptable probability of a CI build waiting 5 minutes in the queue, i.e. 1 out of 10 builds wait 5 minutes (.10)
// 7: same as 6, but for 30 minute wait

const numDev = process.argv[2]; // peak number of developers in organization working concurrently
const numBuildsShift = process.argv[3]; // avg number of builds per peak shift per developer
const avgBuildDurationMin = process.argv[4]; // average build duration
const numShifts = 1; // number of developer shifts (i.e. 1 for single group of devs, 2 for U.S. and India, or 3 for 24-hr development)
const s = 1000;  // max number of build containers to calculate Queue stats for
const probAcceptable5MinWait = process.argv[5]; // acceptable probability of 5 minute wait time for build to start
const probAcceptable30MinWait = process.argv[6]; // acceptable probability of 30 minute wait time for build to start
const shiftDurationHours = 8; // shift duration in hours
const lambda = (numDev * numBuildsShift) / shiftDurationHours / numShifts;  // arrival rate per hour
const mu = 60 / avgBuildDurationMin; // hourly service rate, i.e.

// verify that valid inputs were provided as arguments
if (! process.argv[2] || ! process.argv[3] || ! process.argv[4] || ! process.argv[5] ||
   ! process.argv[6]) {
     printResults('Parameters required for: \navgBuildDurationMin, numShifts, ' +
      'maxNumberBuildContainersToEvaluate, AcceptableProb5MinWait, AcceptableProb30MinWait\n'+
      'for example: $ node infiniteQueueCalc.js 50 5 20 .1 0'
    );
    return;
   }

// calculate the avg number of builds waiting in queue, avg waiting time, and
// avg minion utilization
queueInfinite(lambda, mu, s, function calcQueueStats(err, queueStats) {
  if (err) {
    console.error(err);
    return;
  }
  // print to console the range of relevant data for build environment
  //printResults(results);
  printResults(queueStats);
  writeToFile('output/queueStats.txt', queueStats);

  // generate array of the probability of expected wait times
  expectedWaitTimes(lambda, mu, queueStats, function calcProbWaitTimes(err, probTimes) {
    if (err) {
      console.error(err);
      return;
    }
    // print to console the range of relevant data for build environment
    printResults(probTimes);

    // write the probability of expected wait times to file
    writeToFile('output/expectedWaitTimes.txt', probTimes);

    // determine optimal number of minions per customer tolerance for Wait Time
    recommendedMinions(probAcceptable5MinWait, probAcceptable30MinWait, probTimes,
      function calcRecommendedMinions(err, recMinions) {
      if (err) {
        console.error(err);
        return;
      }
      // print to console the range of relevant data for build environment
        printResults('Recommended minion count: '+ recMinions);

      // write the probability of expected wait times to file
        //writeToFile('output/recommendedMinions.txt', recMinions);
    });
  });
});

function printResults(result) {
    console.log(result);
}
