"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false },
);

interface MonacoViewerProps {
  value: string;
  readOnly?: boolean;
  height?: string;
}

export default function MonacoViewer({
  value,
  readOnly = true,
  height = "300px",
}: MonacoViewerProps) {
  return (
    <MonacoEditor
      height={height}
      value={value}
      language="json"
      theme="vs-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        lineNumbers: "on",
        wordWrap: "on",
        tabSize: 2,
      }}
    />
  );
}
