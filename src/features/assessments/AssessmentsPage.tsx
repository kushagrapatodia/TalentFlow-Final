import { useParams } from 'react-router-dom';
import { useAssessment, useSaveAssessment, useSubmitAssessment } from './api';
import { useState } from 'react';

type Question = {
  id: string;
  type: 'single'|'multi'|'short'|'long'|'number'|'file';
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
  showIf?: { questionId: string; equals: string };
};
type Section = { id: string; title: string; questions: Question[] };

export function AssessmentsPage() {
  const { jobId = '' } = useParams();
  const { data, isLoading } = useAssessment(jobId);
  const save = useSaveAssessment(jobId);
  const submit = useSubmitAssessment(jobId);
  const [candidateId, setCandidateId] = useState('demo-candidate');
  const schema = (data?.schema as { title: string; sections: Section[] }) || { title: 'Assessment', sections: [] };

  function addSection() {
    const next = { ...schema, sections: [...schema.sections, { id: crypto.randomUUID(), title: 'New Section', questions: [] }] };
    save.mutate(next);
  }
  function deleteSection(sectionId: string) {
    const next = { ...schema, sections: schema.sections.filter((s) => s.id !== sectionId) };
    save.mutate(next);
  }
  function addQuestion(sectionId: string, type: Question['type']) {
    const next = { ...schema };
    const sec = next.sections.find((s) => s.id === sectionId);
    if (!sec) return;
    sec.questions.push({ id: crypto.randomUUID(), type, label: 'Question', required: true });
    save.mutate(next);
  }

  if (isLoading) return <p style={{ padding: 24 }}>Loading…</p>;

  return (
    <div style={{ padding: '24px', color: '#1f2937', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', color: '#1f2937' }}>Assessment Builder</h1>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>Create and manage assessments for your jobs.</p>
      </div>
      {/* Assessment Title */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Assessment Title</label>
        <input 
          value={schema.title}
          onChange={(e) => {
            const next = { ...schema, title: e.target.value };
            save.mutate(next);
          }}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', backgroundColor: '#ffffff', color: '#1f2937', outline: 'none', boxSizing: 'border-box' }}
          onFocus={(e) => e.target.style.borderColor = '#22c55e'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
      </div>
      {/* Sections */}
      <div style={{ marginBottom: '24px' }}>
        {schema.sections.map((section, sectionIndex) => (
          <div key={section.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
            {/* Section Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ cursor: 'grab', color: '#9ca3af' }}>⋮⋮</div>
              <input 
                value={section.title}
                onChange={(e) => {
                  const next = { ...schema };
                  next.sections[sectionIndex].title = e.target.value;
                  save.mutate(next);
                }}
                style={{ flex: 1, border: 'none', fontSize: '18px', fontWeight: '600', color: '#374151', background: 'none', outline: 'none' }}
              />
              <button onClick={() => deleteSection(section.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
            </div>
            {/* Section Questions */}
            <div style={{ padding: '16px 20px' }}>
              {/* Render questions - only basic input types, no advanced/conditional logic */}
              {section.questions.map((q, questionIndex) => {
                // Only allow showIf for questions after the first one
                const canHaveShowIf = questionIndex > 0;
                return (
                  <div key={q.id} style={{ marginBottom: '12px', border: q.showIf ? '1px dashed #22c55e' : undefined, padding: q.showIf ? '8px' : undefined }}>
                    <label style={{ fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>{q.label}{q.required ? ' *' : ''}</label>
                    {q.type === 'short' && <input className="input" style={{ width: '100%' }} />}
                    {q.type === 'long' && <textarea className="input" rows={3} style={{ width: '100%' }} />}
                    {q.type === 'number' && <input className="input" type="number" style={{ width: '100%' }} />}
                    {q.type === 'single' && <select className="input" style={{ width: '100%' }}><option value="Yes">Yes</option><option value="No">No</option></select>}
                    {q.type === 'multi' && (
                      <div className="row">
                        <label><input type="checkbox" value="A" /> A</label>
                        <label><input type="checkbox" value="B" /> B</label>
                      </div>
                    )}
                    {q.type === 'file' && <input className="input" type="file" style={{ width: '100%' }} />}
                    {/* Conditional logic UI */}
                    {canHaveShowIf && (
                      <div style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 13, color: '#374151', marginRight: 8 }}>
                          <input
                            type="checkbox"
                            checked={!!q.showIf}
                            onChange={e => {
                              const next = { ...schema };
                              const thisQ = next.sections[sectionIndex].questions[questionIndex];
                              if (e.target.checked) {
                                // Default: first previous question, value 'Yes'
                                const prevQuestions = section.questions.slice(0, questionIndex);
                                if (prevQuestions.length > 0) {
                                  thisQ.showIf = {
                                    questionId: prevQuestions[0].id,
                                    equals: 'Yes'
                                  };
                                }
                              } else {
                                delete thisQ.showIf;
                              }
                              save.mutate(next);
                            }}
                          />{' '}
                          Show only if...
                        </label>
                        {q.showIf && (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                            <span style={{ fontSize: 13 }}>Question:</span>
                            <select
                              value={q.showIf.questionId}
                              onChange={e => {
                                const next = { ...schema };
                                const thisQ = next.sections[sectionIndex].questions[questionIndex];
                                thisQ.showIf!.questionId = e.target.value;
                                save.mutate(next);
                              }}
                            >
                              {section.questions.slice(0, questionIndex).map(prevQ => (
                                <option key={prevQ.id} value={prevQ.id}>{prevQ.label || 'Untitled'}</option>
                              ))}
                            </select>
                            <span style={{ fontSize: 13 }}>Equals:</span>
                            <input
                              type="text"
                              value={q.showIf.equals}
                              onChange={e => {
                                const next = { ...schema };
                                const thisQ = next.sections[sectionIndex].questions[questionIndex];
                                thisQ.showIf!.equals = e.target.value;
                                save.mutate(next);
                              }}
                              placeholder="Value (e.g. Yes)"
                              style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid #d1d5db', minWidth: 60 }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <button onClick={() => addQuestion(section.id, 'short')} style={{ marginTop: '8px', border: 'none', background: '#e5e7eb', color: '#374151', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>+ Add Short Answer</button>
            </div>
          </div>
        ))}
        <button
          onClick={addSection}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', border: 'none', backgroundColor: '#22c55e', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
        >
          ➕ Add Section
        </button>
      </div>
    </div>
  );
}


