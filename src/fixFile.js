import { fixAll } from './repairs.js'
import fs from 'fs'
import path from 'path'

export let fixFile = (filePath, ext = '.md') => {

    if (path.extname(filePath) === ext)

    fs.readFile(filePath, 'utf-8', function (err, content) {

        if (err) {
            console.error(err);
            return
        }

        fixAll(content).then( (fixed) => {

            fs.writeFile(filePath, fixed.fixed, 'utf-8', function (err, content) {

                if (err) {
                    console.error(err);
                    return
                }
            });

            let punctuationLineWarnings = findUnevenPunctuation(fixed.fixed);

            if (fixed.warnings || !!punctuationLineWarnings.length) {

                let today = new Date();

                let date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

                let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

                let dateTime = date + ' ' + time

                let warnings = `(${path.basename(filePath)}) ${dateTime} | ${filePath} \n **WARNINGS**`

                if (fixed.warnings) {
                    warnings += `\n ${fixed.warnings}`;
                }

                if (!!punctuationLineWarnings.length) {
                    for (const warning of punctuationLineWarnings) {
                        warnings += `\n\t↳ ${warning}`
                    }
                }
                warnings += `\n\n`;

                fs.appendFile('./src/logs/log.md', warnings, 'utf-8', function (err, content) {

                    if (err) {
                        console.error(err);
                        return;
                    }
                })

            }
        })

    })
}
const args = process.argv.slice(2)


let findUnevenPunctuation = file => {
    let arr = file.split(/\r?\n/);
    let warnings = arr.map( (line, idx) => {
        const singleQuotes = line.match(/'/gi)
        const doubleQuotes = line.match(/"/gi)
        const singleEngQuotes = line.match(/‘|’/gi)
        const doubleEngQuotes = line.match(/“|”/gi)
        const parentheses = line.match(/\(|\)/gi)
        let evenCheck = (marks, markName) => (marks && marks.length % 2 !== 0) && `line ${idx + 1}: ${marks.length} ${markName} don't match.`

        const parenthesesCheck = evenCheck(parentheses, 'parentheses');
        const singleQuotesCheck = evenCheck(singleQuotes, 'singleQuotes');
        const doubleQuotesCheck = evenCheck(doubleQuotes, 'doubleQuotes');
        const singleEngQuotesCheck = evenCheck(singleEngQuotes, 'singleEngQuotes');
        const doubleEngQuotesCheck = evenCheck(doubleEngQuotes, 'doubleEngQuotes');
        
        const lineWarnings = [parenthesesCheck, singleQuotesCheck, doubleQuotesCheck, singleEngQuotesCheck, doubleEngQuotesCheck]
        return lineWarnings.filter(check => !!check)
    })
    //console.log(warnings)
    return warnings?.flat();
}

let findQuotesErrors = filePath => {
    let file = fs.readFileSync(filePath, "utf8");
    console.log(file);
    let arr = file.split(/\r?\n/);
    arr.forEach((line, idx) => {
        const singleQuotes = line.match(/'/gi)
        const doubleQuotes = line.match(/"/gi)
        const singleEngQuotes = line.match(/‘|’/gi)
        const doubleEngQuotes = line.match(/“|”/gi)
        const parentheses = line.match(/\(|\)/gi)
        if (parentheses && parentheses.length % 2 !== 0) {
            console.log((idx+1)+':'+ parentheses.length + 'parentheses dont match');
        }
        if (singleQuotes && singleQuotes.length % 2 !== 0) {
            console.log((idx+1)+':'+ singleQuotes.length + 'singleQuotes dont match');
        }
        if (doubleQuotes && doubleQuotes.length % 2 !== 0) {
            console.log((idx+1)+':'+ doubleQuotes.length + 'doubleQuotes dont match');
        }
        if (singleEngQuotes && singleEngQuotes.length % 2 !== 0) {
            console.log((idx+1)+':'+ singleEngQuotes.length + 'singleEngQuotes dont match');
        }
        if (doubleEngQuotes && doubleEngQuotes.length % 2 !== 0) {
            console.log((idx+1)+':'+ doubleEngQuotes.length + 'doubleEngQuotes dont match');
        }
    });
}


// if (args.length) fixFile(args[0])
// else fixFile('./src/rep/bibles/JON.usfm', '.usfm')