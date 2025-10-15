"use client";

import { useState, FormEvent, ChangeEvent } from 'react';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        setLoading(true);
        setError('');
        setSummary('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred.');
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h1>Resume Analyzer</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="file">Upload PDF:</label>
                    <input
                        type="file"
                        id="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </div>
                <button type="submit" disabled={loading || !file}>
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {summary && (
                <div>
                    <h2>Summary:</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', background: '#000000', padding: '10px', borderRadius: '5px' }}>
            {summary}
          </pre>
                </div>
            )}
        </main>
    );
}
