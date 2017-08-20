import * as child from 'child_process';

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); //eslint-disable-line
    return v.toString(16);
  });
}

export function execute(command, callback){
  child.exec(command, (err, stdout, stderr) => callback(err, stdout, stderr))
}
