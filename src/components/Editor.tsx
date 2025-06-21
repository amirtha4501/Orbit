import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const menuStyle = "border px-2 py-1 rounded text-sm hover:bg-gray-100";

export default function Editor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="space-y-2">
      {editor && (
        <div className="flex gap-2 flex-wrap border p-2 rounded bg-white sticky top-0 z-10">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={menuStyle}>
            Bold
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={menuStyle}>
            Italic
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={menuStyle}>
            H1
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={menuStyle}>
            H2
          </button>
          <button onClick={() => editor.chain().focus().setParagraph().run()} className={menuStyle}>
            P
          </button>
          <button
            onClick={() => {
              const url = prompt('Enter image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className={menuStyle}
          >
            Image
          </button>
        </div>
      )}
      <div className="border rounded p-3 min-h-[200px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
