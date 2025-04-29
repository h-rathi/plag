// PlagiarismChecker.jsx
import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
const PlagiarismChecker = () => {
    let navigate=useNavigate();
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (localStorage.getItem('token')){
          
        }else{
          navigate('/login')
    
        }
        // eslint-disable-next-line
      }, [])

    const handleTextChange = (e) => {
        setText(e.target.value);
        setResult(null);
        setError(null);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/plain') {
            const content = await file.text();
            setText(content);
            setResult(null);
            setError(null);
        } else {
            alert('Please upload a .txt file');
        }
    };
    const getHighlightedText = () => {
        if (!result || !result.results) return text;
    
        let highlighted = text;
        result.results.forEach(({ user_sentence }) => {
            const escapedSentence = user_sentence.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'); // escape regex
            const regex = new RegExp(escapedSentence, 'g');
            highlighted = highlighted.replace(
                regex,
                `<mark style="background-color: #ffd54f">${user_sentence}</mark>`
            );
        });
    
        return highlighted;
    };
    

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await axios.post('http://localhost:5000/api/plagiarism', { text });
            console.log(response)
            setResult(response.data); // instead of response.data

        } catch (err) {
            setError('Error checking plagiarism');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">🛡️ Plagiarism Checker</h2>
            <div className="mb-3">
    {result ? (
        <div
            className="form-control"
            style={{ whiteSpace: 'pre-wrap', height: 'auto', minHeight: '150px' }}
            dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
        />
    ) : (
        <textarea
            className="form-control"
            rows="8"
            placeholder="Paste or type your text here..."
            value={text}
            onChange={handleTextChange}
        ></textarea>
    )}
</div>

            <div className="mb-3">
                <input type="file" accept=".txt" onChange={handleFileUpload} className="form-control" />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Checking...' : 'Check Plagiarism'}
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {result && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">Result</h5>
                        {result.matches_found > 0 ? (
                            result.results.map((match, index) => (
                                <div key={index} className="mb-3">
                                    <p><strong>Plagiarized Sentence:</strong> {match.user_sentence}</p>
                                    <p><strong>Matched Reference:</strong> {match.reference_sentence}</p>
                                    <p><strong>Score:</strong> {match.prediction_score.toFixed(4)}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p className="text-success">✅ No plagiarism detected.</p>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
};

export default PlagiarismChecker;
