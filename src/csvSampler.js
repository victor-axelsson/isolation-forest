const helper = require('./helper'); 

const config = {
    nrOfTrees: 100,
    subSamplingSize: 1024,
    samplesSeen: 0,
    boundary: {}
};

const getData = () => {
    const raw = helper.loadData('./datasets/Breast_cancer_data.csv');
    return raw.toString().split("\n").map((row) => {
    
        // Skip any empty rows and the header
        if(!row || row.split(",")[0] === "\"mean_radius\""){
            return null;
        }

        const fields = row.split(","); 
    
        return {
            meanRadius: parseFloat(fields[0].trim()),
            meanTexture: parseFloat(fields[1].trim()),
            meanPerimiter: parseFloat(fields[2].trim()),
            meanArea: parseFloat(fields[3].trim()),
            meanSmoothness: parseFloat(fields[4].trim()),
            diagnosis: parseInt(fields[5].trim())
        }
    }).filter(m => !!m); 
}

const getCreditCardData = () => {
    const raw = helper.loadData('./datasets/creditcard.csv');
    return raw.toString().split("\n").map((row) => {
    
        // Skip any empty rows and the header
        if(!row || row.split(",")[0] === "\"Time\""){
            return null;
        }
    
        const fields = row.split(","); 
        const model = {
            time: parseInt(fields[0].trim()),
            amount: parseFloat(fields[29]),
            class: parseInt(fields[30].replace("\"", "").trim())
        }

        for(let i = 1; i < 30; i++){
            model[`v${i}`] =  parseFloat(fields[i].trim())
        }

        return model; 

    }).filter(m => !!m); 
}

const calculateBoundaries = (models) => {
    models.forEach((model) => {
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
    }); 
}

const sample = (data) => {
    const sample = []; 

    for(let i = 0; i < data.length; i++){

        if(sample.length < config.subSamplingSize){
            sample.push(data[i]); 
            continue; 
        }

        // Sample with a probabillity 1 / data length
        var shouldSample = Math.random() < (1 / (data.length));
        if(shouldSample){
            
            // Swap at random in sample
            const swapIndex = helper.getRandomInt(0, sample.length -1)
            sample[swapIndex] = data[i]; 
    
            console.log(`Swapping with probabillity ${1 / (data.length)} at index ${swapIndex}` ); 
        }
    }

    return sample; 
}

const createSamples = (data) => {
    const samples = {
        sample: {}
    }
    for(let i = 0; i < config.nrOfTrees; i++){
        samples.sample[i] = sample(data); 
    }

    samples.config = config; 

    helper.saveJSONData('samples/samples_b.json', samples); 
}

const main = () => {
    const data = getCreditCardData(); 
    calculateBoundaries(data); 
    createSamples(data); 

    console.log(data.length); 
}

main(); 