import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import http from 'http'
import readline from 'node:readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rurl = path.resolve('../a', '../url.js')
const jurl = path.join('../b', '../../url.js')

console.log('rurl', rurl)
console.log('jurl', jurl)

const rs = fs.createReadStream('./imooc-cli/package-lock.json')

const ws = fs.createWriteStream('./text.txt')

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

// rl.on('close', () => {
//   console.log('line', lineLength)
//   nrl.question('你的名字是？', (answer) => {
//     console.log('你输入的名字是', answer)
//     nrl.question('你的年龄是？', (answer) => {
//       console.log('你输入的年龄是', answer)
//       nrl.close()
//     })
//   })
// })

// 将 question 方法 Promise 化
const question = (rlInterface, prompt) => {
  return new Promise((resolve) => {
    rlInterface.question(prompt, resolve)
  }).then((answer) => {
    return answer
  })
}

rl.on('close', async () => {
  console.log('line', lineLength)

  try {
    const name = await question(nrl, '你的名字是？')
    console.log('你输入的名字是', name)

    const age = await question(nrl, '你的年龄是？')
    console.log('你输入的年龄是', age)

    nrl.on('close', () => {
      console.log({
        name,
        age
      })
    })
  } catch (err) {
    console.error('输入过程中发生错误:', err)
  } finally {
    nrl.close()
  }
})

const server = http.createServer((req, res) => {
  res.end('hello world123')
})

server.listen(3000, () => {
  console.log('server is running http://localhost:3000')
})
