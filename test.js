import { fileURLToPath } from 'url'
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rurl = path.resolve('../a', '../url.js');
const jurl = path.join('../b', '../../url.js');

console.log('rurl', rurl)
console.log('jurl', jurl)

// e801c4f6f951f72258a2e039a4e07b65
// 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