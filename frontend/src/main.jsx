import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const FIELD_TYPES = [
  { value: 'string', label: 'Строка' },
  { value: 'textarea', label: 'Текст' },
  { value: 'richtext', label: 'Форматированный текст' },
  { value: 'date', label: 'Дата' },
  { value: 'number', label: 'Число' },
  { value: 'auto', label: 'Авто' },
];

function FieldRow({ field, index, onChange, onRemove }) {
  const update = (key, value) => onChange(index, { ...field, [key]: value });

  return (
    <div
      style={{
        border: '1px solid #e1e1e1',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 10,
      }}
    >
      <div>
        <label>Системное имя</label>
        <input
          type="text"
          value={field.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="client_name"
          style={{ width: '100%' }}
          required
        />
      </div>
      <div>
        <label>Лейбл</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => update('label', e.target.value)}
          placeholder="Имя клиента"
          style={{ width: '100%' }}
          required
        />
      </div>
      <div>
        <label>Тип</label>
        <select value={field.type} onChange={(e) => update('type', e.target.value)} style={{ width: '100%' }}>
          {FIELD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Обязательное поле</label>
        <input type="checkbox" checked={field.required} onChange={(e) => update('required', e.target.checked)} />
      </div>
      <div>
        <label>Плейсхолдер</label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => update('placeholder', e.target.value)}
          placeholder="Введите значение"
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label>Формат / трансформация</label>
        <input
          type="text"
          value={field.format || ''}
          onChange={(e) => update('format', e.target.value)}
          placeholder="DD.MM.YYYY / upperCase"
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label>Источник</label>
        <input
          type="text"
          value={field.source || ''}
          onChange={(e) => update('source', e.target.value)}
          placeholder="crm, 1C"
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ alignSelf: 'flex-end' }}>
        <button type="button" onClick={() => onRemove(index)} style={{ color: '#c62828' }}>
          Удалить поле
        </button>
      </div>
    </div>
  );
}

function TemplateCard({ template, onFileUpload, onGenerate }) {
  const handleFileChange = (event) => {
    if (!event.target.files?.length) return;
    onFileUpload(template.id, event.target.files[0]);
    event.target.value = '';
  };

  const fieldTitles = useMemo(
    () => template.fields.map((f) => `${f.label} (${f.name})`).join(', ') || 'Нет полей',
    [template.fields],
  );

  const hasDocx = Boolean(template.fileOriginalName);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h3 style={{ margin: '8px 0' }}>{template.name}</h3>
      <p style={{ margin: '4px 0' }}>{template.description}</p>
      <p style={{ margin: '4px 0' }}>
        <strong>Статус:</strong> {template.isActive ? 'Активен' : 'Отключен'}
      </p>
      <p style={{ margin: '4px 0' }}>
        <strong>Поля:</strong> {fieldTitles}
      </p>
      <p style={{ margin: '4px 0', color: hasDocx ? '#2e7d32' : '#d32f2f' }}>
        <strong>.docx:</strong> {hasDocx ? template.fileOriginalName : 'не прикреплен'}
      </p>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          border: '1px solid #2196f3',
          color: '#0d47a1',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Загрузить .docx
        <input type="file" accept=".docx" onChange={handleFileChange} style={{ display: 'none' }} />
      </label>

      <button
        type="button"
        onClick={() => onGenerate(template)}
        disabled={!hasDocx}
        style={{
          marginLeft: 12,
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #1976d2',
          background: hasDocx ? '#1976d2' : '#e0e0e0',
          color: hasDocx ? 'white' : '#616161',
          cursor: hasDocx ? 'pointer' : 'not-allowed',
        }}
      >
        Заполнить и сгенерировать
      </button>
    </div>
  );
}

function Instructions({ onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 10,
      }}
    >
      <div style={{ background: '#fff', padding: 24, borderRadius: 12, maxWidth: 720, width: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Правила оформления Word-шаблона</h2>
          <button onClick={onClose} aria-label="Закрыть" style={{ fontSize: 18 }}>
            ×
          </button>
        </div>
        <ol style={{ lineHeight: 1.5 }}>
          <li>
            Используйте <strong>только файл .docx</strong>. Другие форматы не принимаются и будут отклонены на
            загрузке.
          </li>
          <li>
            Вставляйте переменные в тексте как <code>{'{{field_name}}'}</code>, где <em>field_name</em> совпадает с
            системным именем поля.
          </li>
          <li>Не используйте сложные макросы и встроенные объекты: они могут быть отброшены при генерации.</li>
          <li>
            Если требуется список или таблица, готовьте их в шаблоне заранее и помечайте ячейки переменными вместо
            заполнителей.
          </li>
          <li>
            Следите за регистром: <code>{'{{ClientName}}'}</code> и <code>{'{{clientname}}'}</code> — разные переменные.
          </li>
        </ol>
        <p style={{ marginTop: 12, color: '#455a64' }}>
          После загрузки шаблона можно заменить файл новой версией через кнопку «Загрузить .docx» в карточке шаблона.
        </p>
      </div>
    </div>
  );
}

function GenerationModal({ template, fields, values, onChange, onSubmit, onClose, generating }) {
  const renderInput = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: values[field.name] ?? '',
      onChange: (e) => onChange(field.name, e.target.value),
      placeholder: field.placeholder || '',
      required: field.required,
      style: { width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cfd8dc' },
    };

    if (field.type === 'textarea' || field.type === 'richtext') {
      return <textarea rows={4} {...commonProps} />;
    }

    if (field.type === 'date') {
      return <input type="date" {...commonProps} />;
    }

    if (field.type === 'number') {
      return <input type="number" {...commonProps} />;
    }

    return <input type="text" {...commonProps} />;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 20,
      }}
    >
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: '100%', maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, color: '#607d8b', fontSize: 12 }}>Генерация документа</p>
            <h2 style={{ margin: '2px 0 0' }}>{template.name}</h2>
          </div>
          <button onClick={onClose} style={{ fontSize: 18, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fields.map((field) => (
            <label key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontWeight: 600 }}>
                {field.label}
                {field.required && <span style={{ color: '#d32f2f' }}> *</span>}
              </span>
              {renderInput(field)}
              {field.placeholder && (
                <span style={{ color: '#78909c', fontSize: 12 }}>Подсказка: {field.placeholder}</span>
              )}
            </label>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 12px', borderRadius: 8 }}>
              Отмена
            </button>
            <button
              type="submit"
              disabled={generating}
              style={{ padding: '8px 12px', borderRadius: 8, background: '#1976d2', color: 'white' }}
            >
              {generating ? 'Генерация…' : 'Скачать .docx'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    isActive: true,
    fields: [
      {
        name: 'title',
        label: 'Заголовок',
        type: 'string',
        required: true,
        placeholder: 'Введите заголовок',
      },
    ],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [generationFields, setGenerationFields] = useState([]);
  const [generationValues, setGenerationValues] = useState({});
  const [generating, setGenerating] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || '/api';

  useEffect(() => {
    fetch(`${API_BASE}/templates`)
      .then((res) => {
        if (!res.ok) throw new Error('Bad response');
        return res.json();
      })
      .then(setTemplates)
      .catch(() => setError('Не удалось загрузить список шаблонов.'));
  }, [API_BASE]);

  const updateField = (index, next) => {
    setForm((prev) => ({ ...prev, fields: prev.fields.map((f, idx) => (idx === index ? next : f)) }));
  };

  const removeField = (index) => {
    setForm((prev) => ({ ...prev, fields: prev.fields.filter((_, idx) => idx !== index) }));
  };

  const addField = () => {
    setForm((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        { name: `field_${prev.fields.length + 1}`, label: 'Новое поле', type: 'string', required: false },
      ],
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      isActive: true,
      fields: [{ name: 'title', label: 'Заголовок', type: 'string', required: true, placeholder: 'Введите текст' }],
    });
    setSelectedFile(null);
  };

  const uploadDocx = async (templateId, file) => {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch(`${API_BASE}/templates/${templateId}/file`, { method: 'POST', body });
    if (!res.ok) throw new Error('upload_error');
    const updated = await res.json();
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === updated.id);
      if (!exists) return [...prev, updated];
      return prev.map((t) => (t.id === updated.id ? updated : t));
    });
    return updated;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCreating(true);
    try {
      const payload = {
        ...form,
        fields: form.fields.map((f) => ({
          ...f,
          placeholder: f.placeholder || undefined,
          format: f.format || undefined,
          source: f.source || undefined,
          transform: f.transform || undefined,
        })),
      };

      const res = await fetch(`${API_BASE}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('create_error');
      const created = await res.json();

      const finalTemplate = selectedFile ? await uploadDocx(created.id, selectedFile) : created;
      setTemplates((prev) => [...prev, finalTemplate]);
      resetForm();
    } catch (e) {
      console.error(e);
      setError('Не удалось сохранить шаблон. Проверьте данные и повторите попытку.');
    } finally {
      setCreating(false);
    }
  };

  const handleFileUpload = async (templateId, file) => {
    try {
      await uploadDocx(templateId, file);
    } catch (e) {
      console.error(e);
      setError('Файл не загружен. Убедитесь, что выбран .docx и повторите попытку.');
    }
  };

  const openGenerationForm = async (template) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/templates/${template.id}/form`);
      if (!res.ok) throw new Error('form_error');
      const data = await res.json();
      const defaults = {};
      data.fields.forEach((field) => {
        defaults[field.name] = '';
      });
      setActiveTemplate(template);
      setGenerationFields(data.fields);
      setGenerationValues(defaults);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить форму для генерации. Попробуйте ещё раз.');
    }
  };

  const closeGenerationForm = () => {
    setActiveTemplate(null);
    setGenerationFields([]);
    setGenerationValues({});
  };

  const updateGenerationValue = (name, value) => {
    setGenerationValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!activeTemplate) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/templates/${activeTemplate.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationValues),
      });

      if (!res.ok) throw new Error('generate_error');

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition');
      let filename = `${activeTemplate.name || 'document'}.docx`;
      if (disposition) {
        const match =
          /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
        if (match) {
          filename = decodeURIComponent(match[1] || match[2]);
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      closeGenerationForm();
    } catch (e) {
      console.error(e);
      setError('Не удалось сгенерировать документ. Проверьте заполненные данные.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ margin: '4px 0' }}>Templator</h1>
          <p style={{ margin: 0, color: '#455a64' }}>Панель управления шаблонами и генерацией документов</p>
        </div>
        <button
          type="button"
          onClick={() => setShowInstructions(true)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #607d8b', cursor: 'pointer' }}
        >
          Правила для .docx
        </button>
      </header>

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}

      <section style={{ marginTop: 20, padding: 16, border: '1px solid #e0e0e0', borderRadius: 12 }}>
        <h2>Новый шаблон</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              Название
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Договор поставки"
                required
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              Описание
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Формирует типовой договор"
                required
              />
            </label>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Шаблон активен
          </label>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Поля шаблона</h3>
              <button type="button" onClick={addField} style={{ borderRadius: 6, padding: '6px 10px' }}>
                Добавить поле
              </button>
            </div>
            {form.fields.map((field, idx) => (
              <FieldRow key={idx} field={field} index={idx} onChange={updateField} onRemove={removeField} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                border: '1px dashed #90caf9',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Прикрепить .docx
              <input
                type="file"
                accept=".docx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </label>
            <span style={{ color: '#455a64' }}>{selectedFile ? selectedFile.name : 'Файл не выбран'}</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={creating} style={{ padding: '10px 14px', borderRadius: 8 }}>
              {creating ? 'Сохранение…' : 'Сохранить шаблон'}
            </button>
            <button type="button" onClick={resetForm} style={{ padding: '10px 14px', borderRadius: 8 }}>
              Очистить форму
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Сохранённые шаблоны</h2>
        {templates.length === 0 && <p style={{ color: '#78909c' }}>Шаблонов пока нет</p>}
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            onFileUpload={handleFileUpload}
            onGenerate={openGenerationForm}
          />
        ))}
      </section>

      {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
      {activeTemplate && (
        <GenerationModal
          template={activeTemplate}
          fields={generationFields}
          values={generationValues}
          onChange={updateGenerationValue}
          onSubmit={handleGenerate}
          onClose={closeGenerationForm}
          generating={generating}
        />
      )}
    </div>
  );
}

const container = document.getElementById('root');
createRoot(container).render(<App />);
