import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function TemplateCard({ template }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h3>{template.name}</h3>
      <p>{template.description}</p>
      <p><strong>Status:</strong> {template.isActive ? 'active' : 'disabled'}</p>
      <p><strong>Fields:</strong> {template.fields.map((f) => f.name).join(', ')}</p>
    </div>
  );
}

function App() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then(setTemplates)
      .catch(() => setError('Не удалось загрузить список шаблонов.'));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Templator</h1>
      <p>Панель управления шаблонами и генерациями документов.</p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} />
      ))}
    </div>
  );
}

const container = document.getElementById('root');
createRoot(container).render(<App />);
