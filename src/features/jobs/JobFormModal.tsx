import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateJob, useUpdateJob } from './api';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function JobFormModal(props: {
  open: boolean;
  onClose: () => void;
  initial?: { id?: string; title?: string; slug?: string; tags?: string[] };
}) {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: props.initial?.title || '',
      slug: props.initial?.slug || '',
      tags: props.initial?.tags?.join(', ') || '',
    }
  });

  function onSubmit(values: FormValues) {
    const tags = values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    if (props.initial?.id) {
      updateJob.mutate({ id: props.initial.id, title: values.title, slug: values.slug, tags });
    } else {
      createJob.mutate({ title: values.title, slug: values.slug, tags });
    }
    props.onClose();
    reset();
  }

  if (!props.open) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.6)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        style={{ 
          background: '#ffffff', 
          color: '#1f2937', 
          padding: '32px', 
          borderRadius: '12px', 
          minWidth: '480px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e5e7eb'
        }}
      >
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '24px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          textAlign: 'center'
        }}>
          {props.initial?.id ? 'Edit Job' : 'Create Job'}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Title
            </label>
            <input 
              {...register('title')} 
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            {errors.title && (
              <span style={{ 
                color: '#ef4444', 
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                {errors.title.message}
              </span>
            )}
          </div>
          
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Slug
            </label>
            <input 
              {...register('slug')} 
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            {errors.slug && (
              <span style={{ 
                color: '#ef4444', 
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                {errors.slug.message}
              </span>
            )}
          </div>
          
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Tags (comma separated)
            </label>
            <input 
              {...register('tags')} 
              placeholder="e.g. remote, full-time, senior"
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end', 
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button 
            type="button" 
            onClick={props.onClose}
            style={{
              padding: '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            Cancel
          </button>
          <button 
            type="submit"
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#16a34a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#22c55e';
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}


