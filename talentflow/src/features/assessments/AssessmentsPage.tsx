import { useParams } from 'react-router-dom';
import { useAssessment, useSaveAssessment, useSubmitAssessment, useAssignments, useAssignCandidate, useUnassignCandidate } from './api';
import { useState } from 'react';

type Question = { id: string; type: 'single'|'multi'|'short'|'long'|'number'|'file'; label: string; required?: boolean; min?: number; max?: number };
type Section = { id: string; title: string; questions: Question[] };

export function AssessmentsPage() {
  const { jobId = '' } = useParams();
  const { data, isLoading } = useAssessment(jobId);
  const save = useSaveAssessment(jobId);
  const submit = useSubmitAssessment(jobId);
  const [candidateId, setCandidateId] = useState('demo-candidate');
  const assignments = useAssignments(jobId);
  const assign = useAssignCandidate(jobId);
  const unassign = useUnassignCandidate(jobId);

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

  function toggleConditional(sectionId: string, questionId: string) {
    const next = { ...schema } as any;
    for (const s of next.sections) {
      for (const q of s.questions) {
        if (q.id === questionId) {
          // simple conditional: show only if first question in section equals "Yes"
          q.showIf = { questionId: s.questions[0]?.id, equals: 'Yes' };
        }
      }
    }
    save.mutate(next);
  }

  function renderPreview() {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const responses: Record<string, any> = {};
        schema.sections.forEach((s) => s.questions.forEach((q) => {
          const val = formData.get(q.id);
          responses[q.id] = val;
        }));
        // simple validation: required and numeric ranges
        for (const s of schema.sections) {
          for (const q of s.questions) {
            // check conditional visibility
            const visible = (q as any).showIf ? responses[(q as any).showIf.questionId] === (q as any).showIf.equals : true;
            if (!visible) continue;
            const v = responses[q.id];
            if (q.required && (v === null || v === '' )) {
              alert(`Missing required: ${q.label}`); return;
            }
            if (q.type === 'number' && v !== null && v !== '') {
              const n = Number(v);
              if (Number.isNaN(n)) { alert(`${q.label} must be a number`); return; }
              if (q.min != null && n < q.min) { alert(`${q.label} must be >= ${q.min}`); return; }
              if (q.max != null && n > q.max) { alert(`${q.label} must be <= ${q.max}`); return; }
            }
          }
        }
        submit.mutate({ candidateId, responses });
        alert('Submitted');
      }}>
        {schema.sections.map((s) => (
          <div key={s.id} style={{ marginBottom: 16, padding: 8, border: '1px solid #444' }}>
            <h4>{s.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.questions.map((q) => {
                const visible = (q as any).showIf ? (form as any)?.[ (q as any).showIf.questionId ]?.value === (q as any).showIf.equals : true;
                if (!visible) return null;
                return (
                  <label key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span>{q.label}{q.required ? ' *' : ''}</span>
                    {q.type === 'short' && <input name={q.id} className="input" />}
                    {q.type === 'long' && <textarea name={q.id} className="input" rows={3} />}
                    {q.type === 'number' && <input name={q.id} className="input" type="number" min={q.min} max={q.max} />}
                    {q.type === 'single' && <select name={q.id} className="input"><option value="Yes">Yes</option><option value="No">No</option></select>}
                    {q.type === 'multi' && (
                      <div className="row">
                        <label><input type="checkbox" name={q.id} value="A" /> A</label>
                        <label><input type="checkbox" name={q.id} value="B" /> B</label>
                      </div>
                    )}
                    {q.type === 'file' && <input name={q.id} className="input" type="file" />}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Candidate ID" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} />
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }

  if (isLoading) return <p style={{ padding: 24 }}>Loading…</p>;

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: 16 }}>
      <div>
        <h2>Builder</h2>
        <button className="btn" onClick={addSection}>Add Section</button>
        <div className="col" style={{ marginTop: 12 }}>
          {schema.sections.map((s) => (
            <div key={s.id} className="card">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{s.title}</strong>
                <div className="row">
                  <button className="btn secondary" onClick={() => addQuestion(s.id, 'short')}>+ Short</button>
                  <button className="btn secondary" onClick={() => addQuestion(s.id, 'long')}>+ Long</button>
                  <button className="btn secondary" onClick={() => addQuestion(s.id, 'number')}>+ Number</button>
                  <button className="btn secondary" onClick={() => addQuestion(s.id, 'single')}>+ Single</button>
                  <button className="btn secondary" onClick={() => addQuestion(s.id, 'multi')}>+ Multi</button>
                  <button className="btn secondary" onClick={() => addQuestion(s.id, 'file')}>+ File</button>
                  <button className="btn" onClick={() => deleteSection(s.id)}>Delete</button>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: .8 }}>Tip: Select a question then click “Set Conditional” to reveal only when the first question equals “Yes”.</div>
              {s.questions.length > 0 && (
                <div className="row" style={{ marginTop: 8, flexWrap: 'wrap', gap: 6 }}>
                  {s.questions.map((q) => (
                    <button key={q.id} className="btn secondary" onClick={() => toggleConditional(s.id, q.id)}>Set Conditional</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Live Preview</h2>
        {renderPreview()}
      </div>
      <div>
        <h2>Assignments</h2>
        <form onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget as HTMLFormElement; const input = form.elements.namedItem('cid') as HTMLInputElement; if (input.value.trim()) { assign.mutate({ candidateId: input.value.trim() }); input.value=''; } }} className="row" style={{ gap: 8 }}>
          <input name="cid" placeholder="Candidate ID" className="input" />
          <button className="btn" type="submit">Assign</button>
        </form>
        <div className="col" style={{ marginTop: 12 }}>
          {assignments.data?.items?.length ? assignments.data.items.map((a) => (
            <div key={a.id} className="row" style={{ justifyContent: 'space-between' }}>
              <span>{a.candidateId}</span>
              <button className="btn secondary" onClick={() => unassign.mutate(a.candidateId)}>Remove</button>
            </div>
          )) : <div className="card">No assignments yet.</div>}
        </div>
      </div>
    </div>
  );
}


