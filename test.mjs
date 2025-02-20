import { fileURLToPath } from 'url'
import path from 'path';
import fs from 'fs';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rurl = path.resolve('../a', '../url.js');
const jurl = path.join('../b', '../../url.js');

console.log('rurl', rurl)
console.log('jurl', jurl)



const rs = fs.createReadStream('./imooc-cli/package-lock.json');

const rl = readline.createInterface({
  input: fs.createReadStream('./imooc-cli/package-lock.json')
})

const ws = fs.createWriteStream('./text.txt');

const nrl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let length = 0
let lineLength = 0

rs.on('data', (chunk) => {
  let l = chunk.toString().length
  console.log(l)
  length += l
})

rs.on('end', () => {
  console.log('length', length)
})

rs.pipe(ws)

rl.on('line', (line) => {
  lineLength++
})
rl.on('close', () => {
  console.log('line', lineLength)
  nrl.question('请输入你的名字 ', (answer) => {
    console.log('你输入的名字是', answer)
    nrl.close()
  })
})





