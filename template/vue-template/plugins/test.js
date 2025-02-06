import plugin from './index.js'
import { makeList } from './inquirer.js'

(async function () { 
  const res = await plugin({ makeList })
  console.log(res)
})()