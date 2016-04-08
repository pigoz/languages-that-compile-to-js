// USAGE:
// $> node bus-factor.js clojure/clojurescript
// 68.95% – swannodette – (209226)
// 3.76% – brentonashworth – (11412)
// 3.68% – richhickey – (11181)
// 3.48% – stuarthalloway – (10561)
// 2.23% – michalmarczyk – (6756)
// 1.63% – bobby – (4950)
// 1.54% – bostonou – (4682)
// 1.50% – EricThorsen – (4550)
// 1.30% – fogus – (3939)
// 1.15% – Chouser – (3487)

const fetch = require('node-fetch');
const _ = require('lodash');
const process = require('process');
const url = `https://api.github.com/repos/${process.argv[2]}/stats/contributors`;

function contributions(user) {
  // deletions are more valuable, because they imply refactorings and/or
  // better understanding of the codebase
  return user.weeks.reduce((accu, n) => accu + n.a + n.c + n.d * 2, 0);
}

fetch(url)
  .then((res) => res.json())
  .then((json) => {
    const stats = json.map((user) => ({
      login: user.author.login,
      contributions: contributions(user),
    }));
    const sorted = _.sortBy(stats, 'contributions');
    const sum = _.sum(sorted.map(x => x.contributions));
    const biggest = _.reverse(_.takeRight(sorted, 10));
    biggest.map(x => {
      x.percent = (x.contributions * 100.0 / sum).toFixed(2);
      return x;
    }).forEach(x => {
      console.log(`${x.percent}% – ${x.login} – (${x.contributions})`);
    });
  });
