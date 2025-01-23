import { oraPromise } from "ora";

(async function () {
  const promise = new Promise((resolve, reject) => {
    console.log('do somthing...')
    setTimeout(() => {
      resolve('done')
    }, 3000)
  })

  await oraPromise( promise, {
    text: 'loading...',
    spinner: 'dots',
    color: 'green',
    successText: 'success!',
    failText: 'fail!',
    prefixText: 'Downloading...',
  })
})()