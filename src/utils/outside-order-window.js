export default function (thisHourInNYC) {
  return !['10', '11', '12', '13'].includes(thisHourInNYC);
}
