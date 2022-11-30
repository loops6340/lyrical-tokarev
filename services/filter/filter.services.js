const fs = require('fs')

String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
  };

class FilterService{
    constructor(){
        this.filterArr = JSON.parse(fs.readFileSync(__dirname + '/filter.json'))
    }

    filter(data){

        const newStr = data.split(' ').map(i => {
            i = i.toLowerCase()
            let punctuation = ""
            let split = i.split("")
            let lastChar = split[split.length-1]
            if(lastChar === ',' ||lastChar === '.' ||lastChar === ';' || lastChar === ':'){
                punctuation = split.pop()
            }
            i = split.join("")
            console.log(i)
            this.filterArr.forEach(j => {
                if(i === j.word + 's' || i === j.word.slice(0, -1)+'ies'){
                    let wordToReplace = j.replaceArr[Math.floor((Math.random()*j.replaceArr.length))]
                    const index = j.replaceArr.indexOf(wordToReplace)
                    if(j.s[index] === null){
                        wordToReplace += 's'
                    }
                    else if(parseInt(j.s[index])){
                        const splitWord = wordToReplace.split('')
                        splitWord[j.s[index]] = 's '
                        wordToReplace = splitWord.join('')
                    }
                    else if(j.s[index].form){
                        wordToReplace = wordToReplace.replaceBetween(j.s[index].first, j.s[index].last, j.s[index].form)
                    }

                    i = wordToReplace
                }
                else if(i === j.word){
                    i = j.replaceArr[Math.floor((Math.random()*j.replaceArr.length))]
                }
            })
            return i + punctuation
        }).join(' ')

        return newStr

    }
    
}

const test = new FilterService()

console.log(test.filter("I HATE TRANNIES, NIGGERS, JEWS AND FAGGOTS ALSO FUCK GNOSTICS FUCK THEM FUCK YOU IF YOU ARE GNOSTIC A NIGGER A TRANNY OR A FAGGOT."))



module.exports = FilterService