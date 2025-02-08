import { fileURLToPath } from 'url'
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rurl = path.resolve('../a', '../url.js');
const jurl = path.join('../b', '../../url.js');

console.log('rurl', rurl)
console.log('jurl', jurl)