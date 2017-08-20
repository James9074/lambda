import nodeRunner from './node'
import javaRunner from './java'

export default function StartRunners(lambda: Object, inputs: Array, req: Object, res: Object) {
  if (!lambda)
    return res.status(500).json({ error: 'Lambda not found!' })
  switch (lambda.language){
    case 'node':
      return nodeRunner(lambda, inputs, req, res);
    case 'java':
      return javaRunner(lambda, inputs, req, res);
    default:
      return res.status('400').json({ error: `${lambda.language} is not a valid lambda language.
        Please use one of the following: node, java` })
  }
}
