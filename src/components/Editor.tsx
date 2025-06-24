import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Plugin } from 'prosemirror-state';
import { FontFamily, FontSize } from './CustomExtention';

const menuStyle = "border px-2 py-1 rounded text-sm hover:bg-gray-100";

export default function Editor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, TextStyle, FontSize, FontFamily.configure({ types: ['textStyle'] })],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            if (!file) return false;

            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result;
              editor?.chain().focus().setImage({ src: base64 as string }).run();
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  return (
    <div className="space-y-2">
      {editor && (
        <div className="flex gap-2 flex-wrap border p-2 rounded bg-white sticky top-0 z-10">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={menuStyle}>Bold</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={menuStyle}>Italic</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={menuStyle}>H1</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={menuStyle}>H2</button>
          <button onClick={() => editor.chain().focus().setParagraph().run()} className={menuStyle}>P</button>
          <button
            onClick={() => {
              const url = prompt('Enter image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className={menuStyle}
          >
            Image
          </button>
          <select
            onChange={(e) =>
              editor?.chain().focus().setFontFamily(e.target.value).run()
            }
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="Inter">Inter</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
          </select>
          <select
            onChange={(e) =>
              editor?.chain().focus().setFontSize(e.target.value).run()
            }
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="24px">24px</option>
            <option value="32px">32px</option>
          </select>
        </div>
      )}
      <div className="flex justify-center py-8 bg-gray-50 min-h-screen">
        <div
          className="bg-white shadow-md px-16 py-12 rounded-md w-[816px] min-h-[1056px] font-sans border border-gray-200"
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
