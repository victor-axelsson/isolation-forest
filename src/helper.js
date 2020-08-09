const fs = require('fs'); 

const helper = {}; 

helper.getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

helper.getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min; 
}

helper.loadJSONData = (filename) => {
    return JSON.parse(fs.readFileSync(filename)); 
}

helper.loadData = (filename) => {
    return fs.readFileSync(filename).toString(); 
}

helper.saveJSONData = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data)); 
}

module.exports = helper; 