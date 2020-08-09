const helper = require('./helper');

const config = {
    nrOfTrees: 100,
    subSamplingSize: 256,
    samplesSeen: 0,
    boundary: {}
};

const sample = {}; 

const calculateBoundaries = (model) => {
    Object.keys(model).forEach((attribute) => {
        if(!(attribute in config.boundary)){
            config.boundary[attribute] = {}; 
        }

        // Give default values for attribute max and min
        if(!("max" in config.boundary[attribute])){
            config.boundary[attribute].max = 0; 
        }

        if(!("min" in config.boundary[attribute])){
            config.boundary[attribute].min = Number.POSITIVE_INFINITY; 
        }

        config.boundary[attribute].max = Math.max(model[attribute], config.boundary[attribute].max); 
        config.boundary[attribute].min = Math.min(model[attribute], config.boundary[attribute].min); 
    }); 
}

const subSample = (data) => {
    for(let i = 0; i < config.nrOfTrees; i++){
        if(!sample[i]){
            sample[i] = []; 
        }

        for(let j = 0; j < data.length; j++){

            calculateBoundaries(data[j])
            
            //Add everything to the sample if not filled up yet
            if(sample[i].length < config.subSamplingSize){
                sample[i].push(data[j]); 
                continue; 
            }
    
            // Sample with a probabillity 1 / samplesSeen
            var shouldSample = Math.random() < (1 / (config.samplesSeen + j + 1));
            if(shouldSample){
                
                // Swap at random in sample
                const swapIndex = helper.getRandomInt(0, sample[i].length -1)
                sample[i][swapIndex] = data[j]; 

                console.log(`Swapping with probabillity ${1 / (config.samplesSeen + j +1)} at index ${swapIndex} in sub-sample ${i}` ); 
            }
        }
    }

    config.samplesSeen += data.length; 
}

const cacheSamples = () => {
    try{
        helper.saveJSONData(`samples/samples.json`, {
            config, 
            sample
        })
    }catch(e){
        console.log(e)
    }
}

const main = () => {
    setInterval(() => {
        const si = require('systeminformation');
        si.processes().then((data) => {
            subSample(data.list); 
            cacheSamples(); 
        });
    }, 1000)
}

main(); 