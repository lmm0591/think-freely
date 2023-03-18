const fs = require('fs');
const text = fs.readFileSync('./packages/core/report/coverage/coverage-summary.json', 'utf-8');
const { merge } = require('mochawesome-merge');

const statements = JSON.parse(text).total.statements;
const coverReport = {
  schemaVersion: 1,
  label: 'coverage',
  message: `${statements.pct}`,
  color: 'green',
};
console.log('coverReport: ', coverReport);
fs.writeFileSync('./packages/editor/dist/core-shields-cover-report.json', JSON.stringify(coverReport));

const options = {
  files: ['./packages/core/report/tests/*.json'],
};

merge(options).then((report) => {
  const { stats } = report;
  const testReport = {
    schemaVersion: 1,
    label: 'tests',
    message: `${stats.tests} passed,${stats.failures} failed`,
    color: 'green',
  };
  console.log('testReport: ', testReport);
  fs.writeFileSync('./packages/editor/dist/core-shields-tests-report.json', JSON.stringify(testReport));
});
