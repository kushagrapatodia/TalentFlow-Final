import { useState, useRef, useEffect } from 'react';
import { useAddCandidateNote } from './api';

// Mock team members for @mentions
const TEAM_MEMBERS = [
  { id: 'john-doe', name: 'John Doe', email: 'john@company.com' },
  { id: 'jane-smith', name: 'Jane Smith', email: 'jane@company.com' },
  { id: 'mike-johnson', name: 'Mike Johnson', email: 'mike@company.com' },
  { id: 'sarah-wilson', name: 'Sarah Wilson', email: 'sarah@company.com' },
  { id: 'alex-brown', name: 'Alex Brown', email: 'alex@company.com' },
];

interface CandidateNotesSectionProps {
  candidateId: string;
  notes?: Array<{
    id: string;
    content: string;
    author: string;
    timestamp: number;
    mentions: string[];
  }>;
}

export function CandidateNotesSection({ candidateId, notes = [] }: CandidateNotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addNote = useAddCandidateNote(candidateId);

  const filteredMembers = TEAM_MEMBERS.filter(member => 
    member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setNewNote(value);
    setCursorPosition(cursorPos);

    // Check for @ mentions
    const textBeforeCursor = value.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (atMatch) {
      setMentionQuery(atMatch[1]);
      setShowMentions(true);
      
      // Calculate position for mentions dropdown
      const textarea = e.target;
      const { offsetTop, offsetLeft } = textarea;
      const lineHeight = 24;
      const lines = textBeforeCursor.split('\n').length - 1;
      
      setMentionPosition({
        top: offsetTop + (lines * lineHeight) + 30,
        left: offsetLeft + 10
      });
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (member: typeof TEAM_MEMBERS[0]) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const value = newNote;
    const cursorPos = cursorPosition;
    
    // Find the @ position
    const textBeforeCursor = value.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (atMatch) {
      const atPosition = cursorPos - atMatch[0].length;
      const beforeAt = value.slice(0, atPosition);
      const afterCursor = value.slice(cursorPos);
      const mentionText = `@${member.name} `;
      
      const newValue = beforeAt + mentionText + afterCursor;
      setNewNote(newValue);
      setShowMentions(false);
      
      // Set cursor position after the mention
      setTimeout(() => {
        const newCursorPos = atPosition + mentionText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    // Extract mentions from the note
    const mentions = Array.from(newNote.matchAll(/@(\w+(?:\s+\w+)*)/g))
      .map(match => match[1])
      .filter(mention => TEAM_MEMBERS.some(member => member.name === mention));

    addNote.mutate({
      content: newNote,
      mentions
    }, {
      onSuccess: () => {
        setNewNote('');
      }
    });
  };

  const renderNoteContent = (content: string) => {
    // Replace @mentions with styled spans
    return content.replace(/@(\w+(?:\s+\w+)*)/g, (match, name) => {
      const member = TEAM_MEMBERS.find(m => m.name === name);
      return member ? `<span style="color: #2563eb; font-weight: 500; background-color: #eff6ff; padding: 2px 4px; border-radius: 4px;">${match}</span>` : match;
    });
  };

  useEffect(() => {
    const handleClickOutside = () => setShowMentions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        margin: '0 0 16px 0',
        color: '#1f2937'
      }}>
        Notes & Comments
      </h3>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={newNote}
            onChange={handleTextChange}
            placeholder="Add a note... Use @name to mention team members"
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
          />
          
          {/* Mentions Dropdown */}
          {showMentions && filteredMembers.length > 0 && (
            <div style={{
              position: 'absolute',
              top: mentionPosition.top,
              left: mentionPosition.left,
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              minWidth: '200px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => insertMention(member)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {member.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '12px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Use @name to mention team members
          </div>
          <button
            type="submit"
            disabled={!newNote.trim() || addNote.isPending}
            style={{
              backgroundColor: newNote.trim() ? '#22c55e' : '#f3f4f6',
              color: newNote.trim() ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: newNote.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            {addNote.isPending ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>

      {/* Existing Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            No notes yet. Add the first note above.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#1f2937'
                }}>
                  {note.author}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280'
                }}>
                  {new Date(note.timestamp).toLocaleString()}
                </div>
              </div>
              <div 
                style={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  lineHeight: '1.5'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: renderNoteContent(note.content) 
                }}
              />
              {note.mentions.length > 0 && (
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '12px', 
                  color: '#6b7280'
                }}>
                  Mentioned: {note.mentions.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
