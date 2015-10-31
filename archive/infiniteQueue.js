'use strict';

const queueInfinite = require('./queueInfinite-module.js');

const numDev = process.argv[2]; // number of developers in organization
const numBuildsShift = process.argv[3]; // number of builds per shift per developer
const avgBuildDurationMin = process.argv[4]; // average = build duration
const shiftDurationHours = process.argv[5]; // shift duration in hours
const lambda = (numDev * numBuildsShift) / shiftDurationHours;  // arrival rate per hour
const mu = 60 / avgBuildDurationMin; // hourly service rate, i.e.
const s = process.argv[6];  // number of build containers
const roundToDigits = 2;

queueInfinite(lambda, mu, s, function calcAvgNumWaiting(err, avgNumWaiting) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Average Queue Size = '+ roundNum(avgNumWaiting, roundToDigits) + ' builds');
  calcAvgWaitDuration(avgNumWaiting);
  calcAvgUtilizationMinions(lambda, mu, s);
});

function calcAvgWaitDuration(avgNumWaiting) {
  let avgWaitDuration = (avgNumWaiting / lambda) * 60;  // in minutes
  console.log('Average Wait Duration = ' + roundNum(avgWaitDuration, roundToDigits) + ' minutes');
}

function calcAvgUtilizationMinions(lambda, mu, s) {
  let avgMinionUtilization = (lambda / (mu * s)) * 100;
  console.log('Average Minion Utilization = ' + roundNum(avgMinionUtilization, roundToDigits) + '%');
}

function roundNum(num, digits) {
    return +(Math.round(num + 'e+'+digits)  + 'e-'+digits);
}
