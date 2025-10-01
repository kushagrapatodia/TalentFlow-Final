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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', color: 'black', padding: 16, borderRadius: 8, minWidth: 360 }}>
        <h3 style={{ marginTop: 0 }}>{props.initial?.id ? 'Edit Job' : 'Create Job'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Title
            <input {...register('title')} style={{ width: '100%', padding: 8 }} />
            {errors.title && <span style={{ color: 'crimson' }}>{errors.title.message}</span>}
          </label>
          <label>
            Slug
            <input {...register('slug')} style={{ width: '100%', padding: 8 }} />
            {errors.slug && <span style={{ color: 'crimson' }}>{errors.slug.message}</span>}
          </label>
          <label>
            Tags (comma separated)
            <input {...register('tags')} style={{ width: '100%', padding: 8 }} />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" onClick={props.onClose}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}


