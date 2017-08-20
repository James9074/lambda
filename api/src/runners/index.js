import nodeRunner from './node'
// import javaRunner from './java'

export default function StartRunners(lambda: Object, inputs: Array, req: Object, res: Object) {
  nodeRunner(lambda, inputs, req, res);
}
