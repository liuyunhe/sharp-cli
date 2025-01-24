#!/usr/bin/env node

import a from '@shepardliu/test-cli-a'
import b from '@shepardliu/test-cli-b'
// console.log('Running CLI...')
a()
b()

export default function () {
  console.log('Running CLI...')
}
// console.log('CLI finished.')
