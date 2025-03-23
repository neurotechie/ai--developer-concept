tate-of-the-art Machine Learning for the Web

Run 🤗 Transformers directly in your browser, with no need for a server!

Transformers.js is designed to be functionally equivalent to Hugging Face's transformers python library, meaning you can run the same pretrained models using a very similar API. These models support common tasks in different modalities, such as:

📝 Natural Language Processing: text classification, named entity recognition, question answering, language modeling, summarization, translation, multiple choice, and text generation.
🖼️ Computer Vision: image classification, object detection, segmentation, and depth estimation.
🗣️ Audio: automatic speech recognition, audio classification, and text-to-speech.
🐙 Multimodal: embeddings, zero-shot audio classification, zero-shot image classification, and zero-shot object detection.
Transformers.js uses ONNX Runtime to run models in the browser. The best part about it, is that you can easily convert your pretrained PyTorch, TensorFlow, or JAX models to ONNX using 🤗 Optimum.

For more information, check out the full documentation.

Installation
To install via NPM, run:

npm i @huggingface/transformers
Alternatively, you can use it in vanilla JS, without any bundler, by using a CDN or static hosting. For example, using ES Modules, you can import the library with:

<script type="module">
    import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0';
</script>

Quick tour
It's super simple to translate from existing code! Just like the python library, we support the pipeline API. Pipelines group together a pretrained model with preprocessing of inputs and postprocessing of outputs, making it the easiest way to run models with the library.

Python (original) Javascript (ours)
from transformers import pipeline

# Allocate a pipeline for sentiment-analysis

pipe = pipeline('sentiment-analysis')

out = pipe('I love transformers!')

# [{'label': 'POSITIVE', 'score': 0.999806941}]

import { pipeline } from '@huggingface/transformers';

// Allocate a pipeline for sentiment-analysis
const pipe = await pipeline('sentiment-analysis');

const out = await pipe('I love transformers!');
// [{'label': 'POSITIVE', 'score': 0.999817686}]
You can also use a different model by specifying the model id or path as the second argument to the pipeline function. For example:

// Use a different model for sentiment-analysis
const pipe = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
By default, when running in the browser, the model will be run on your CPU (via WASM). If you would like to run the model on your GPU (via WebGPU), you can do this by setting device: 'webgpu', for example:

// Run the model on WebGPU
const pipe = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
device: 'webgpu',
});
For more information, check out the WebGPU guide.

[!WARNING] The WebGPU API is still experimental in many browsers, so if you run into any issues, please file a bug report.

In resource-constrained environments, such as web browsers, it is advisable to use a quantized version of the model to lower bandwidth and optimize performance. This can be achieved by adjusting the dtype option, which allows you to select the appropriate data type for your model. While the available options may vary depending on the specific model, typical choices include "fp32" (default for WebGPU), "fp16", "q8" (default for WASM), and "q4". For more information, check out the quantization guide.

// Run the model at 4-bit quantization
const pipe = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
dtype: 'q4',
});
