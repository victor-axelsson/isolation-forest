
const helper = require('./helper'); 

const iTree = (samples, currentTreeHeight, heightLimit, boundary) => {

    // This is the base case
    if(currentTreeHeight >= heightLimit || samples.length <= 1){
        return {
            type: "external",
            size: samples.length
        }
    }

    // These are the used attributes
    const attributes = ["pcpu", "pcpuu", "pcpus", "pmem", "priority","mem_vsz", "mem_rss"]; 
    //const attributes = ["meanRadius", "meanTexture", "meanPerimiter", "meanArea", "meanSmoothness"]; 
    
    /*
    const attributes = ["time", "amount", "class"]; 
    for(let i = 1; i < 30; i++){
        attributes.push(`v${i}`); 
    }   
    */
    
    // Select an attribute at random
    const q = attributes[helper.getRandomInt(0, attributes.length -1)]; 

    // Select a split point in min max at random
    const p = helper.getRandomFloat(boundary[q].min, boundary[q].max); 

    // Split into two partitions of the selected attribute
    const x_l = samples.filter(x => x[q] < p); 
    const x_r = samples.filter(x => x[q] >= p); 
    
    // Recursively run the tTree untill you hit the base case
    return {
        type: "internal",
        left: iTree(x_l, currentTreeHeight + 1, heightLimit, boundary),
        right: iTree(x_r, currentTreeHeight + 1, heightLimit, boundary),
        splitAtt: q, 
        splitValue: p,
        size: samples.length
    };
}

const iForest = (samples, nrOfTrees, subSamplingSize, boundary) => {
    const forest = []; 
    const heightLimit = Math.ceil(Math.log2(subSamplingSize))
    for(let i = 0; i < nrOfTrees; i++){
        forest.push(iTree(samples[i], 0, heightLimit, boundary)); 
    }
    return forest; 
}

const pathLength = (x, iTree, e) => {
    if(iTree.type == "external"){
        return e + adjustmentC(iTree.size);
    }

    const a = iTree.splitAtt;
    if(x[a] < iTree.splitValue){
        return pathLength(x, iTree.left, e + 1);
    }

    return pathLength(x, iTree.right, e + 1); 
}

const adjustmentC = (n) => {
    const harmonicNumber = (i) => {
        return Math.log(i) + 0.5772156649; 
    }

    if(n <= 1){
        return 0; 
    }

    return 2 * harmonicNumber(n - 1) - (2 * (n - 1) / n); 
}

const findAnomalies = (data, forest) => {
    const getAvg = (items) => {
        const sum = items.reduce((a, b) => a + b, 0);
        return items.length > 0 ? (sum / items.length) : 0;
    }

    const scoredItems = Object.keys(data.sample).reduce((acc, i) => {
        const sample = data.sample[i]; 
        
        const items = sample.reduce((_acc, x) => {
            const pathLengths = forest.map((iTree) => {
                return pathLength(x, iTree, 0); 
            }); 

            const score = Math.pow(2, ( - (getAvg(pathLengths) / adjustmentC(data.config.subSamplingSize))));

            return _acc.concat({
                avgScore: score,
                ...x
            }); 
        }, []); 

        return acc.concat(items); 
    }, []).sort((a, b) => b.avgScore - a.avgScore)

   return scoredItems; 
}

const calculateAccuracy = (anomalies) => {
    let minScore = 99999999999; 
    let maxScore = 0
    const threshold = 0.7; 
    const labelName = "class"; 
    //const labelName = "diagnosis"; 

    let truePositives = 0;
    let falsePositives = 0;  
    let trueNegatives = 0; 
    let falseNegatives = 0; 

    let nrOfPositive = 0; 
    let nrOfNegative = 0; 

    for(let i = 0; i < anomalies.length; i++){
        minScore = Math.min(minScore, anomalies[i].avgScore); 
        maxScore = Math.max(maxScore, anomalies[i].avgScore)

        nrOfNegative = anomalies[i][labelName] == 1 ? nrOfNegative : nrOfNegative +1; 
        nrOfPositive = anomalies[i][labelName] == 1 ? nrOfPositive + 1 : nrOfPositive; 

        if(anomalies[i].avgScore > threshold){
            if(anomalies[i][labelName] == 1){
                truePositives++; 
            }else{
                falsePositives++
            }
        }else{
            if(anomalies[i][labelName] == 1){
                falseNegatives++; 
            }else{
                trueNegatives++;
            }
        }
    }

    const sensitivity = truePositives / (truePositives + falseNegatives); 
    const specificity = trueNegatives / (trueNegatives + falsePositives); 
    const precision = truePositives / (truePositives + falsePositives); 

    let message = `NrOfSamples: ${anomalies.length}, MinScore: ${minScore} MaxScores: ${maxScore} Threshold: ${
        threshold
    } \n\nTruePositives: ${truePositives / anomalies.length} \tTrueNegatives: ${
        trueNegatives / anomalies.length
    } \nFalsePositives: ${
        falsePositives / anomalies.length
    } \tFalseNegatives: ${
        falseNegatives / anomalies.length
    }\nSensitivity: ${sensitivity} \tSpecificity:${specificity} \tPrecision${precision}`
    
    console.log(message);
}


const main = () => {
    const data = helper.loadJSONData('samples/samples.json'); 
    const forest = iForest(data.sample, data.config.nrOfTrees, data.config.subSamplingSize, data.config.boundary)
    const anomalies = findAnomalies(data, forest); 

    console.log(anomalies[0]);
    console.log(anomalies[1]);
    console.log(anomalies[2]);


    //calculateAccuracy(anomalies); 
}


main(); 