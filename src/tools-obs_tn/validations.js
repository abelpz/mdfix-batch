//import { fixAll } from './repairs.js'
import fs from 'fs'
import path from 'path'

let getStories = filePath => {
  const files = fs.readdirSync(filePath)
  let stories = {}
  files.forEach(function (file) {
    if (path.extname(file) == ".md") {
      const story = parseInt(path.basename(file, ".md"))
      const frames = getStory(`${filePath}/${file}`);
      stories = {
        ...stories,
        [story] : frames
      }
    }
  })
  return stories;
}

let getStory = (obsPath) => {
  let file = fs.readFileSync(obsPath, "utf8");
  let arr = file.split(/(?:[\r\n]+?!\[.+\)[\r\n]+?)/gm);

  let storyArrWithLines = arr.map((frame, idx) => {
    return { line: 4 * idx + 1, content:frame };
  });
  return storyArrWithLines;
}

let getNotFoundQuotes = (obsTnPath, obsPath) => {
  let file = fs.readFileSync(obsTnPath, "utf8");
  //console.log(file)
  let arr = file.split(/\r?\n/);
  const stories = getStories(obsPath)
  //console.log(stories);
  const compareNote = (line, idx) => {
    const columns = line.split(/\t/g);
    const reference = columns[0].split(':')
    const storyRef = reference[0];
    const frameRef = parseInt(reference[1]);
    const noteId = columns[1];
    const quote = columns[4];
    //console.log({storyRef,frameRef})
    const frameObj = (storyRef && frameRef) && stories[storyRef][frameRef];
    
    if (frameObj && !frameObj.content.includes(quote)) {
      console.log(`- [ ] [note line **${idx+1}**, story line **${frameObj.line}**, story ref **${storyRef}:${frameRef}**]: Quote (**${quote}**) in note [**${noteId}**] not found in story.`)
    }
  }
  arr.forEach((line, idx) => {
    if (idx !== 0) {
      compareNote(line, idx);
    }
  });
}


const obsTnPath = '../rep/es-419_obs-tn/tn_OBS.tsv'
const obsPath = '../rep/es-419_obs/content'
//getStories(obsPath);
getNotFoundQuotes(obsTnPath,obsPath)