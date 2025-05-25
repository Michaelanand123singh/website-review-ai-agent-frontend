import React, { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitUrl = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error('Failed to fetch report');
      const data = await res.json();
      setReport(data.report);
    } catch (e) {
      setError(e.message);
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
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />
      <button onClick={submitUrl} disabled={loading || !url} style={{ marginTop: 10, padding: '10px 20px' }}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {report && (
        <div style={{ marginTop: 30 }}>
          <h2>{report.title}</h2>
          <p><strong>URL:</strong> <a href={report.url} target="_blank" rel="noreferrer">{report.url}</a></p>
          <p><strong>Description:</strong> {report.description}</p>
          <h3>Detailed Analysis</h3>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f7f7f7', padding: 10, borderRadius: 5 }}>
            {report.analysis}
          </pre>
          <a
            href={`http://localhost:5000/api/reports/${report.id}/download`}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-block', marginTop: 15, textDecoration: 'none', color: 'white', backgroundColor: '#007bff', padding: '10px 15px', borderRadius: 5 }}
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
