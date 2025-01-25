'use strict';

import a from '../lib/index.js';
import assert from 'assert';

const { strict } = assert

strict.strictEqual(a(), 'Hello from a')
console.info('a tests passed');
