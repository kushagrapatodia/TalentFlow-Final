import { useParams } from 'react-router-dom';
import { useAssessment, useSubmitAssessment } from './api';
import { useState } from 'react';

type Question = { id: string; type: 'single'|'multi'|'short'|'long'|'number'|'file'; label: string; required?: boolean; min?: number; max?: number } & { showIf?: { questionId: string; equals: string } };
type Section = { id: string; title: string; questions: Question[] };

export function AssessmentsTakePage() {
  const { jobId = '' } = useParams();
  const { data, isLoading } = useAssessment(jobId);
  const submit = useSubmitAssessment(jobId);
  const [candidateId, setCandidateId] = useState('demo-candidate');

  const schema = (data?.schema as { title: string; sections: Section[] }) || { title: 'Assessment', sections: [] };

  if (isLoading) return <p style={{ padding: 24 }}>Loading…</p>;

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 36 }}>{schema.title}</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const responses: Record<string, any> = {};
        schema.sections.forEach((s) => s.questions.forEach((q) => {
          const val = formData.get(q.id);
          responses[q.id] = val;
        }));
        for (const s of schema.sections) {
          for (const q of s.questions) {
            const visible = q.showIf ? responses[q.showIf.questionId] === q.showIf.equals : true;
            if (!visible) continue;
            const v = responses[q.id];
            if (q.required && (v === null || v === '')) { alert(`Missing required: ${q.label}`); return; }
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
              {s.questions.map((q) => (
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
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Candidate ID" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} />
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}


