import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function MyEditor({ content, onChangeContent }) {
  const [editorContent, setEditorContent] = useState(content || "");

  // Đồng bộ state local khi prop content thay đổi (reset editor)
  useEffect(() => {
    setEditorContent(content || "");
  }, [content]);

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={editorContent}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorContent(data);
          onChangeContent(data);
        }}
      />
    </div>
  );
}
