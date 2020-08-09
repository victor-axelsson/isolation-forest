# About
This project is the base for a tutorial. The main educational material can be found on my YouTube channel. 

In this tutorial you will learn topics: 

- Sampling from a static dataset
- Sampling from a stream with reservoir sampling
- Using the algorithm isolation forest to identify anomalies in streams and batch data

The code provided is only basis for for educational purposes only and production implementations should be at your own diescretion. The code in this project is provided "as is". 

# Datasets
The breast cancer data set used is collected from [kaggle](https://www.kaggle.com/merishnasuwal/breast-cancer-prediction-dataset/data#). 

The creadit card data set used is collected from [kaggle credit cards](https://www.kaggle.com/arshahuja/anomaly-detection)

The other dataset is created from system processes and sampled with reservoir sampling. 

Feel free to add any other datasets of your own and play around with it. 

# Agenda
This section descibes the tutorial agenda. 

## Sampling
I order to deal with large datasets you might want to grab some subset of your data and play around with. However, this might not seem as trivial as you might think. If you simply select the first n items in your database table, how can you ensure that this data is not statistically skewed? Maybe the first rows in the database was test data from developers or invalid in other ways. 

This somewhat simplified explanation is why you would want to use a well-known sampling algorithm. 

In this tutorial we are going to use an algorithm called reservoir sampling. When I reffer to sampling in this text, I will be intending reservoir sampling. This algorithms is really simple and will have the same statistically properties as your dataset in whole. However, there are 2 thing you should consider: 

- Sampling, by definition, does not use all the data from the dataset
- Sampling is not neccesarilly deterministic

What this means in prictice is that if you put items in your sample at random you will not get the same sample everytime you run it. It is not deterministic. Since it is not deterministic, and smaller than the sampled set, you might "miss" critical data points.

- You will find my implementation of reservior sampling from a static dataset in `src/csvSampler.js`
- You will find my implementation of reservoir sampling from a stream in `src/streamSampler.js`

Both of these scripts will output into the `samples` folder. The data size can be quite different but the format should be somewhat simmilar. If you are playing around with any other dataset you will have to edit the code do deal with different field names. 

## Anomaly detection
Once you have a json data sample file ready you should be able to try out the anomaly detection algorithm. The main focus of this tutorial is to gain an intuative understanding of the isolation forest algorithm. 

The easiest way to gain this understanding are the following steps

- Watch my series on youtube and follow along in the implementation
- Read the paper (see references)
- Play around with the implementation with some other dataset

You can find my implementation in `src/isolationForest.js`

Isolation forest is good for: 

- Small datasets
- Linear time complexity
- High dimensions with a lot of irrelevant attributes
- Low memory usage



## Evaluation
Once the implementation is in place the times comes for you to play around with it. But consider the following things: 

- How would you know if the algorithm works. 
- How would you know if your improvements are actually made the algorithm better. 
- How does this algorithm compare with other algorithms.

On many levels an algorithm is worthless without the possabillity of evaluation. 

I have a very detailed series on how to evaluate classifiers on YouTube. 

# References
Fei Tony Liu, Kai Ming Ting, and Zhi-Hua Zhou. 2008. Isolation Forest. In Proceedings of the 2008 Eighth IEEE International Conference on Data Mining (ICDM ’08). IEEE Computer Society, USA, 413–422. DOI:https://doi.org/10.1109/ICDM.2008.17
