import chalk, { Chalk } from 'chalk'

console.log(chalk.blue('Hello world!'))
console.log(chalk.blue('Hello world!') + ' ! ' + chalk.red('Hello world !'))
console.log(chalk.red.bgGreen.bold('Hello world!'))
console.log(chalk.red('hello', 'world!'))
console.log(chalk.red('hello', chalk.underline('world!')))

console.log(chalk.rgb(255, 0, 0).underline('hello world!'))
console.log(chalk.rgb(255, 0, 0)('hello', chalk.underline('world!')))
console.log(chalk.hex('#c1c1c1').bold('hello world!'))
console.log(chalk.hex('#c1c1c1')('hello world!'))

// 定义一个名为error的箭头函数，该函数接受任意数量的参数，并使用chalk库将参数文本加粗并设置为红色
/**
 * 创建一个函数，用于将传入的文本以红色加粗的形式输出。
 * @param {...string} text - 任意数量的字符串参数，这些字符串将被组合并输出。
 * @returns {string} - 返回红色加粗的文本。
 */
const error = (...msg) => console.log(chalk.bold.hex('#ff0000')(msg))

// 定义一个名为warning的箭头函数，该函数接受任意数量的参数，并使用chalk模块将参数以#ffa500的颜色输出
/**
 * 打印带有黄色高亮警告信息的函数
 * @param {...*} text - 要打印的文本
 * @returns {string} - 返回带有黄色高亮警告信息的字符串
 */
const warning = (...msg) => console.log(chalk.hex('#ffa500')(msg))

error('hello world!')
warning('hello world!')


// 创建一个新的Chalk实例，设置level为0
// Levels:
// 0 - All colors disabled.
// 1 - Basic 16 colors support.
// 2 - ANSI 256 colors support.
// 3 - Truecolor 16 million colors support.
const customChalk = new Chalk({ level: 0 })
console.log(customChalk.blue('hello world!'))
console.log(customChalk.hex('#ffaa00')('hello world!'))
