import os
import numpy as np
import pickle
import tensorflow as tf
import requests

from gensim.models import Word2Vec

# Load models
w2v_model = pickle.load(open('word2vec_model.pkl', 'rb'))
best_model = pickle.load(open('best_model.pkl', 'rb'))
vector_size = w2v_model.vector_size

# Files
reference_file = "reference_text.txt"
reference_sentences_file = "reference_sentences.pkl"
reference_vectors_file = "reference_vectors.pkl"

book_urls = [
    "https://www.gutenberg.org/files/1342/1342-0.txt",
    "https://www.gutenberg.org/files/11/11-0.txt",
    "https://www.gutenberg.org/files/1661/1661-0.txt",
    "https://www.gutenberg.org/files/84/84-0.txt",
    "https://www.gutenberg.org/files/74/74-0.txt",
    "https://www.gutenberg.org/files/76/76-0.txt",
    "https://www.gutenberg.org/files/5200/5200-0.txt",
    "https://www.gutenberg.org/files/98/98-0.txt",
    "https://www.gutenberg.org/files/2701/2701-0.txt",
    "https://www.gutenberg.org/files/1080/1080-0.txt",
]

# Download reference books if not present
if not os.path.exists(reference_file):
    with open(reference_file, 'wb') as f:
        for url in book_urls:
            response = requests.get(url, stream=True)
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)

# Create sentence vectors if not present
if not os.path.exists(reference_sentences_file) or not os.path.exists(reference_vectors_file):
    with open(reference_file, 'r', encoding='utf-8') as f:
        reference_text = f.read()

    reference_sentences = [sentence.strip() for sentence in reference_text.split('.') if sentence.strip()]
    pickle.dump(reference_sentences, open(reference_sentences_file, 'wb'))

    reference_vectors = []
    for sentence in reference_sentences:
        words = sentence.lower().split()
        word_vecs = [w2v_model.wv[word] for word in words if word in w2v_model.wv]
        if not word_vecs:
            vec = np.zeros(vector_size)
        else:
            vec = np.mean(word_vecs, axis=0)
        reference_vectors.append(vec)

    reference_vectors = np.array(reference_vectors)
    pickle.dump(reference_vectors, open(reference_vectors_file, 'wb'))

print("Preparation done successfully ")
