// I legit couldn't think of a better name for this file.
import fs from 'fs'
import { uuidv4, execute } from '../util'

export default function JavaRunner(lambda: Object, inputs: Array, req: Object, res: Object) {
  let expression = lambda.code;
  let result = '';
  inputs.forEach((input, i) => inputs[i] = input.replace(/'/g, "\\\'").replace(/"/g, '\\\"').replace(/`/g, '\\\`')) //eslint-disable-line
  let javaArgs = `"${inputs.join('" "')}"`
  //console.log(inputs)
  //console.log(javaArgs)
  try {
    let tempFile = `/tmp/files/${uuidv4()}.java`
    fs.writeFile(tempFile, expression, 'utf8', (saveError) => {
      if (saveError)
        return res.json({ error: 'Error saving file', details: saveError });

      let dockerstr = `docker run --rm -v ${tempFile}:/tmp/Lambda.java java:alpine sh -c 'cd /tmp && javac Lambda.java && \
java Lambda ${javaArgs}'`
                       console.log(dockerstr)
      execute(dockerstr, (err, stdout, stderr) => {
        if (/(entryPoint is not defined)+/.test(stderr)) stderr = "You must provide a function named 'entryPoint'" //eslint-disable-line
        if (stdout.trim() === 'undefined') stdout = 'Nothing returned!'; //eslint-disable-line
        if (stderr){
          return res.status(400).json({ lambda_error: stderr.trim() })
        } else if (err){
          return res.status(500).json({ error: err })
        } else {
          return res.json({ output: stdout.trim() })
        }
      });
    });
  } catch (e) {
    result = e.toString();
    if (result === undefined)
      result = 'undefined'
    if (result === null)
      result = 'null'
    if (result.length === 0)
      result = 'Nothing returned'

    res.json(result)
  }
}
