import { lint } from './linter.js'
import fs from 'fs'
import path from 'path'

export let lintFile = filePath => {

    if (path.extname(filePath) === '.md')

    fs.readFile(filePath, 'utf-8', function (err, content) {

        if (err) {
            console.error(err);
            return
        }

        lint(content).then((linted) => {

            if (linted) {

                let today = new Date();

                let date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

                let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

                let dateTime = date + ' ' + time

                let warnings = `(${path.basename(filePath)}) ${dateTime} | ${filePath} \n [WARNINGS] \n ${linted} \n\n`

                fs.appendFile('./src/logs/log.txt', warnings, 'utf-8', function (err, content) {

                    if (err) {
                        console.error(err);
                        return;
                    }
                })

            }
        })

    })
}
//lintFile('./src/rep/es-419_tw/bible/kt/savior.md')