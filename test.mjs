import { fileURLToPath } from 'url'
import path from 'path';
import fs from 'fs';
import http from 'http';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rurl = path.resolve('../a', '../url.js');
const jurl = path.join('../b', '../../url.js');

console.log('rurl', rurl)
console.log('jurl', jurl)

const rs = fs.createReadStream('./imooc-cli/package-lock.json');

const ws = fs.createWriteStream('./text.txt');

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

const rl = readline.createInterface({
  input: fs.createReadStream('./imooc-cli/package-lock.json')
})

const nrl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (line) => {
  lineLength++
})
rl.on('close', () => {
  console.log('line', lineLength)
  nrl.question('你的名字是？', (answer) => {
    console.log('你输入的名字是', answer)
    nrl.close()
  })
})
const server = http.createServer((req, res) => {
  res.end('hello world123')
})

server.listen(3000, () => {
  console.log('server is running http://localhost:3000')
})





