import sys
import numpy as np
import pickle
import tensorflow as tf
import json

# Load models and data
w2v_model = pickle.load(open('word2vec_model.pkl', 'rb'))
best_model = pickle.load(open('best_model.pkl', 'rb'))
reference_sentences = pickle.load(open('reference_sentences.pkl', 'rb'))
reference_vectors = pickle.load(open('reference_vectors.pkl', 'rb'))
vector_size = w2v_model.vector_size

threshold = 0.5

@tf.function(reduce_retracing=True)
def predict_lstm(input_tensor):
    return best_model(input_tensor, training=False)

# Get user text from command line
user_text = sys.argv[1]
user_sentences = [sentence.strip() for sentence in user_text.split('.') if sentence.strip()]

# Check plagiarism
results = []
for i, u_sentence in enumerate(user_sentences):
    words = u_sentence.lower().split()
    word_vecs = [w2v_model.wv[word] for word in words if word in w2v_model.wv]
    if not word_vecs:
        plag_vec = np.zeros(vector_size)
    else:
        plag_vec = np.mean(word_vecs, axis=0)

    for j, ref_vec in enumerate(reference_vectors):
        test_input = np.hstack([ref_vec, plag_vec]).reshape(1, 1, -1)
        test_tensor = tf.convert_to_tensor(test_input, dtype=tf.float32)

        prediction = predict_lstm(test_tensor).numpy()

        if prediction > threshold:
            results.append({
                'user_sentence': u_sentence,
                'reference_sentence': reference_sentences[j],
                'prediction_score': float(prediction[0][0])
            })
            break

# Send results back
output = {
    'matches_found': len(results),
    'results': results
}
print(json.dumps(output))
