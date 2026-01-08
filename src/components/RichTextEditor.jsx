import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '../styles/richTextEditor.css';

/**
 * Rich Text Editor Component
 * A customized Tiptap editor with limited formatting options
 * Supports: Bold, Italic, Lists (Ordered/Unordered), Links
 */
const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Enter text...',
    className = '',
    disabled = false
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable features we don't need
                heading: false,
                blockquote: false,
                code: false,
                codeBlock: false,
                horizontalRule: false,
                strike: false,
            }),
        ],
        content: value || '',
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    // Update editor content when value prop changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    // Update editable state when disabled prop changes
    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const MenuBar = () => (
        <div className="menu-bar">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                disabled={disabled}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                disabled={disabled}
                title="Italic"
            >
                <em>I</em>
            </button>
            <div className="separator" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
                disabled={disabled}
                title="Bullet List"
            >
                • List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
                disabled={disabled}
                title="Numbered List"
            >
                1. List
            </button>
            <div className="separator" />
            <button
                type="button"
                onClick={setLink}
                className={editor.isActive('link') ? 'is-active' : ''}
                disabled={disabled}
                title="Insert Link"
            >
                🔗 Link
            </button>
            {editor.isActive('link') && (
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={disabled}
                    title="Remove Link"
                >
                    ✕
                </button>
            )}
        </div>
    );

    return (
        <div className={`rich-text-editor ${className}`}>
            <MenuBar />
            <EditorContent
                editor={editor}
                className="editor-content"
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
