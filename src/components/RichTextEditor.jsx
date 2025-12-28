import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/richTextEditor.css';

/**
 * Rich Text Editor Component
 * A customized react-quill editor with limited formatting options
 * Supports: Bold, Italic, Lists (Ordered/Unordered), Links
 */
const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Enter text...',
    className = '',
    disabled = false
}) => {
    // Toolbar configuration - limited to essential formatting options
    const modules = {
        toolbar: [
            ['bold', 'italic'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    // Allowed formats
    const formats = [
        'bold', 'italic',
        'list', 'bullet',
        'link'
    ];

    return (
        <div className={`rich-text-editor ${className}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                readOnly={disabled}
                className="bg-white"
            />
        </div>
    );
};

export default RichTextEditor;
