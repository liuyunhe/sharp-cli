import ora from 'ora'

export default function () {
  const spinner = ora('Loading').start()

  setTimeout(() => {
    spinner.succeed('Loading complete')
  }, 3000)
}