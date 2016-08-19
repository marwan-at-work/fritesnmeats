import fetch from 'node-fetch';
import { AllHtmlEntities } from 'html-entities';
import stripTags from 'striptags';

const link = 'http://fritesnmeats.blogspot.mx/';
const entity = new AllHtmlEntities;
let retrieved = false;
let BOTW = `go to ${link} to see this week's BOTW`;

export default function() {
  if (!retrieved) {
    fetch(link).then(resp => resp.text()).then(text => {
      const l = text.split('\n').find(line => line.includes('BOTW'));
      BOTW = entity.decode(stripTags(l));
      retrieved = true;
    }).catch(err => console.log(err));
  }

  return BOTW;
};
