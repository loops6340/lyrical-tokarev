const fs = require('fs')

class FilterService{
    constructor(){
        this.filterArr = fs.readFileSync(__dirname + '/filter.json')
    }
}