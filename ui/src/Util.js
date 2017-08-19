export default function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
}
