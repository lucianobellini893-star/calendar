// Run with: node tests/timezone.cjs
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=readFileSync(join(__dirname,'..','index.html'),'utf8');
const source=html.slice(html.indexOf("const ROME_ZONE="),html.indexOf('function updateItalyClock'));
const context=vm.createContext({Intl,Date,Map,Set,Number});
vm.runInContext(source,context);
const run=code=>vm.runInContext(code,context);
for(const [day,time,expected] of [
 ['2026-01-15','09:00','2026-01-15T08:00:00.000Z'],
 ['2026-07-15','09:00','2026-07-15T07:00:00.000Z'],
 ['2026-03-29','01:30','2026-03-29T00:30:00.000Z'],
 ['2026-03-29','03:30','2026-03-29T01:30:00.000Z'],
 ['2026-10-25','02:30','2026-10-25T00:30:00.000Z'],
 ['2026-10-25','03:30','2026-10-25T02:30:00.000Z']
])assert.equal(run(`new Date(meetingInstant('${day}','${time}')).toISOString()`),expected);
assert(run("Number.isNaN(meetingInstant('2026-03-29','02:30'))"));
assert(run("Number.isNaN(meetingInstant('2026-02-30','09:00'))"));
assert(run("Number.isNaN(meetingInstant('wrong','09:00'))"));
assert.equal(run("romeToday(Date.parse('2026-07-14T22:30:00Z'))"),'2026-07-15');
assert.equal(run("romeToday(Date.parse('2026-01-14T23:30:00Z'))"),'2026-01-15');
console.log('PASS: Italy winter/summer, DST gap/overlap, invalid dates, Italian date at midnight');
