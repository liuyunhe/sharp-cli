import chalk from 'chalk'

// red
console.log('\x1b[31mhello world\x1b[39m123') 
console.log('\u001b[31mhello world\u001b[39m 123') 

// ansi转义字符汇总和定义
console.log(chalk.red('hello world 123'))

// 特殊字符
// \n
console.log('\x1b[31mhello\nworld\x1b[39m')
console.log('\x1b[42m\x1b[31mhello world\x1b[39m\x1b[49m')