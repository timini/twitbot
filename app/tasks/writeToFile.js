import { BaseTask } from './task';
import { writeFileSync, unlinkSync, existsSync } from 'fs';

let DATA_DIR_PATH;
if (process.env.CONTAINERISED) {
  DATA_DIR_PATH = '/data';
} else {
  DATA_DIR_PATH = '../data';
}

export default class writeToFile extends BaseTask {
  constructor(args) {
    super(args);
    const filename = args.filename || 'data';
    this._path = `${DATA_DIR_PATH}/${filename}.json`;
  }
  run(data) {
    console.log(data);
    return new Promise(resolve => {
      if (existsSync(this._path)) {
        unlinkSync(this._path);
      }
      writeFileSync(this._path, JSON.stringify(data, null, '  '));
      resolve(true);
    })
  }
}
