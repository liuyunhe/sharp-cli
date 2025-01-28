import path from 'node:path'
import { execa } from 'execa'
import { console } from 'node:inspector'

const cli = path.resolve(__dirname, '../bin/cli.js')

const bin =
  () =>
  (...args) =>
    execa(cli, args)

// 测试运行错误的命令
test('run error command', async () => {
  const { stderr } = await bin()('iii')
  expect(stderr).toContain('未知的命令:iii')
})

// 测试运行帮助命令
test('should not throw error when run help', async () => {
  let error = null
  try {
    await bin()('-h')
  } catch (e) {
    error = e
  }
  expect(error).toBeNull()
})

// 测试运行版本命令
test('show correct version when run --version or -V', async () => {
  const { stdout: version1 } = await bin()('--version')
  const { stdout: version2 } = await bin()('-V')
  expect(version1).toContain(require('../package.json').version)
  expect(version1).toBe(version2)
})

// 测试运行debug命令

test('open debug mode', async () => {
  let error = null
  try {
    await bin()('--debug')
  } catch (e) {
    error = e
  }
  expect(error.message).toContain('开启调试模式')
})
