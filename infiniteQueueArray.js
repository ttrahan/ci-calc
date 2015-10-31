'use strict';

const queueInfinite = require('./node_modules/custom/queueInfiniteCalcs-module.js');
const expectedWaitTimes = require('./node_modules/custom/expectedWaitTimes-module.js');
const writeToFile = require('./node_modules/custom/writeToFile-module.js');
const recommendedMinions = require('./node_modules/custom/recommendedMinions.js');

// user must provide 5 command line arguments:
// 1: number of developers
// 2: number of builds each developer builds per shift
// 3: the duration of the average build in their organization
// 4: the number of developer shifts, i.e. when groups of devs are concurrently working
// 5: the total number of concurrent build containers to evaluate results for

const numDev = process.argv[2]; // number of developers in organization
const numBuildsShift = process.argv[3]; // number of builds per shift per developer
const avgBuildDurationMin = process.argv[4]; // average build duration
const numShifts = process.argv[5]; // number of developer shifts (i.e. 1 for single group of devs, 2 for U.S. and India, or 3 for 24-hr development)
const s = process.argv[6];  // max number of build containers to calculate Queue stats for
const minutesAcceptableWait = process.argv[7]; // acceptable wait time per build in minutes
const shiftDurationHours = 8; // shift duration in hours
const lambda = (numDev * numBuildsShift) / shiftDurationHours / numShifts;  // arrival rate per hour
const mu = 60 / avgBuildDurationMin; // hourly service rate, i.e.

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
    recommendedMinions(minutesAcceptableWait, probTimes, function calcRecommendedMinions(err, recMinions) {
      if (err) {
        console.error(err);
        return;
      }
      // print to console the range of relevant data for build environment
        printResults(recMinions);

      // write the probability of expected wait times to file
        writeToFile('output/recommendedMinions.txt', recMinions);
    });
  });
});

function printResults(result) {
    console.log(result);
}
