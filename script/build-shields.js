const fs = require('fs');
const text = fs.readFileSync('./report/coverage/coverage-summary.json', 'utf-8');
const { merge } = require('mochawesome-merge');

const statements = JSON.parse(text).total.statements;
const coverReport = {
  schemaVersion: 1,
  label: 'coverage',
  message: `${statements.pct}`,
  color: 'green',
};
console.log('coverReport: ', coverReport);
fs.writeFileSync('./dist/core-shields-cover-report.json', JSON.stringify(coverReport));

const options = {
  files: ['./report/tests/*.json'],
};

merge(options).then((report) => {
  const { stats } = report;
  const testReport = {
    schemaVersion: 1,
    label: 'tests',
    message: `${stats.tests} tests,${stats.passes} passed,${stats.pending} pending,${stats.failures} failed`,
    color: 'green',
  };
  console.log('testReport: ', testReport);
  fs.writeFileSync('./dist/core-shields-tests-report.json', JSON.stringify(testReport));
});
