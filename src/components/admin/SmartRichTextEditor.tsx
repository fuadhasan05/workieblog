import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatArticleContent, sanitizeContent } from '@/lib/utils/formatContent';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
} from 'lucide-react';

export interface SmartRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function SmartRichTextEditor({ content, onChange, placeholder }: SmartRichTextEditorProps) {
  const [plainMode, setPlainMode] = useState(false);
  const [plainText, setPlainText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Auto-format pasted text
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (plainMode) {
      setPlainText(text);
      onChange(text);
    } else {
      const formatted = text.replace(/"([^"]*)"/g, '"$1"')
        .replace(/\s+/g, ' ')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
      editor?.commands.insertContent(formatted);
    }
    e.preventDefault();
  };

  // Content analysis
  const contentText = useMemo(() => plainMode ? plainText : editor?.getText() || '', [plainMode, plainText, editor]);
  const wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  // Smart heading suggestion
  const headingSuggestion = useMemo(() => {
    if (wordCount > 300 && !(contentText.match(/\n#+\s/) || contentText.match(/<h[1-6]>/))) {
      return 'Consider adding headings to organize your article.';
    }
    return '';
  }, [contentText, wordCount]);

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    editor?.commands.setImage({ src: url });
  };

  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        <Button 
          type="button" 
          variant={plainMode ? 'default' : 'outline'} 
          onClick={() => setPlainMode(!plainMode)}
          size="sm"
        >
          {plainMode ? 'Rich Text' : 'Plain Text'}
        </Button>
        <Button 
          type="button" 
          variant={showPreview ? 'default' : 'outline'} 
          onClick={() => setShowPreview(!showPreview)}
          size="sm"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
        <span className="text-xs text-muted-foreground self-center">{wordCount} words • {readTime} min read</span>
        {headingSuggestion && <span className="text-xs text-orange-600 self-center">{headingSuggestion}</span>}
      </div>

      {plainMode ? (
        <div>
          <Textarea
            value={plainText}
            onChange={e => {
              setPlainText(e.target.value);
              onChange(e.target.value);
            }}
            onPaste={handlePaste}
            rows={20}
            placeholder={placeholder || 'Write your content...'}
            className="min-h-[400px] font-mono"
            spellCheck={true}
          />
          {showPreview && (
            <div className="prose prose-lg max-w-none p-4 min-h-[400px] border rounded bg-gray-50 overflow-auto mt-4 my-4">
              <div dangerouslySetInnerHTML={{ __html: sanitizeContent(formatArticleContent(plainText)) }} />
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded border mb-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'bg-gray-300' : ''}
              type="button"
            >
              <Bold size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'bg-gray-300' : ''}
              type="button"
            >
              <Italic size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={editor?.isActive('underline') ? 'bg-gray-300' : ''}
              type="button"
            >
              <UnderlineIcon size={16} />
            </Button>
            <div className="w-px bg-gray-300"></div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor?.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}
              type="button"
            >
              <Heading2 size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor?.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}
              type="button"
            >
              <Heading3 size={16} />
            </Button>
            <div className="w-px bg-gray-300"></div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive('bulletList') ? 'bg-gray-300' : ''}
              type="button"
            >
              <List size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive('orderedList') ? 'bg-gray-300' : ''}
              type="button"
            >
              <ListOrdered size={16} />
            </Button>
            <div className="w-px bg-gray-300"></div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={editor?.isActive('codeBlock') ? 'bg-gray-300' : ''}
              type="button"
            >
              <Code size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={editor?.isActive('blockquote') ? 'bg-gray-300' : ''}
              type="button"
            >
              <Quote size={16} />
            </Button>
            <div className="w-px bg-gray-300"></div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}
              type="button"
            >
              <AlignLeft size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              className={editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}
              type="button"
            >
              <AlignCenter size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              className={editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}
              type="button"
            >
              <AlignRight size={16} />
            </Button>
            <div className="w-px bg-gray-300"></div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().clearNodes().run()}
              type="button"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="flex gap-2 mb-2">
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {imageUrl && <img src={imageUrl} alt="Uploaded" className="h-10" />}
          </div>
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none border rounded"
            onPaste={handlePaste}
          />
          {showPreview && (
            <div className="prose prose-lg max-w-none p-4 min-h-[400px] border rounded bg-gray-50 overflow-auto mt-4 my-4">
              <div dangerouslySetInnerHTML={{ __html: sanitizeContent(editor?.getHTML() || '') }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
