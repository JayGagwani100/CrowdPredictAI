// tensorflowModel.ts
import * as tf from '@tensorflow/tfjs';

// Prepare training data from time and crowd levels
const prepareTrainingData = (times: number[], levels: number[]) => {
  const xs = tf.tensor(times).div(tf.scalar(24));  // Normalize time
  const ys = tf.tensor(levels).div(tf.scalar(100)); // Normalize levels
  return { xs, ys };
};

// Create a simple TensorFlow model
export const createModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  model.compile({ optimizer: tf.train.sgd(0.1), loss: 'meanSquaredError' });
  return model;
};

// Train the model with loaded data
export const trainModelWithData = async (model: tf.Sequential, placeId: string) => {
  const { times, levels } = await loadTrainingData(placeId);
  const { xs, ys } = prepareTrainingData(times, levels);

  await model.fit(xs, ys, { epochs: 200, verbose: 1 });

  xs.dispose();
  ys.dispose();
};

// Load training data from Firebase
export const loadTrainingData = async (placeId: string) => {
  const response = await fetch(`https://YOUR_PROJECT_ID.firebaseio.com/crowds/${placeId}.json`);
  const data = await response.json();

  const times = Object.values(data).map((entry: any) => new Date(entry.time).getHours());
  const levels = Object.values(data).map((entry: any) => entry.crowdLevel);
  return { times, levels };
};

// Predict crowd level for a specific hour
export const predictNextHourCrowd = (model: tf.Sequential, nextHour: number) => {
  const inputTensor = tf.tensor([nextHour]).div(tf.scalar(24));
  const prediction = model.predict(inputTensor) as tf.Tensor;
  const predictedLevel = prediction.dataSync()[0] * 100;

  inputTensor.dispose();
  prediction.dispose();

  return Math.round(predictedLevel);
};
