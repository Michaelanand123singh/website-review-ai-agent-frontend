import React, { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Updated to use your Render backend URL
  const API_BASE_URL = 'https://website-review-ai-agent-backend.onrender.com';

  const submitUrl = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/review`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add CORS headers if needed
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }
      
      const data = await res.json();
      setReport(data.report);
    } catch (e) {
      console.error('Error:', e);
      setError(e.message || 'Failed to analyze website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>Dubai Marketing Agency Review AI</h1>
      <input
        type="text"
        placeholder="Enter marketing agency website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ 
          width: '100%', 
          padding: 10, 
          fontSize: 16,
          border: '1px solid #ddd',
          borderRadius: 4
        }}
      />
      <button 
        onClick={submitUrl} 
        disabled={loading || !url} 
        style={{ 
          marginTop: 10, 
          padding: '10px 20px',
          backgroundColor: loading || !url ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading || !url ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: 10, 
          borderRadius: 4, 
          marginTop: 10,
          border: '1px solid #ffcdd2'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {report && (
        <div style={{ marginTop: 30 }}>
          <h2>{report.title}</h2>
          <p><strong>URL:</strong> <a href={report.url} target="_blank" rel="noreferrer">{report.url}</a></p>
          <p><strong>Description:</strong> {report.description}</p>
          <h3>Detailed Analysis</h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            backgroundColor: '#f7f7f7', 
            padding: 15, 
            borderRadius: 5,
            border: '1px solid #ddd',
            fontSize: 14,
            lineHeight: 1.5,
            maxHeight: 400,
            overflow: 'auto'
          }}>
            {report.analysis}
          </pre>
          <a
            href={`${API_BASE_URL}/api/reports/${report.id}/download`}
            target="_blank"
            rel="noreferrer"
            style={{ 
              display: 'inline-block', 
              marginTop: 15, 
              textDecoration: 'none', 
              color: 'white', 
              backgroundColor: '#28a745', 
              padding: '10px 15px', 
              borderRadius: 5,
              fontWeight: 'bold'
            }}
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}