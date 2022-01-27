import { useEffect, useState, useRef } from 'react';
import Editor from "@monaco-editor/react";

import { loadPyodide } from 'pyodide/pyodide'

import './App.css';

function App() {
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [pyodide, setPyodide] = useState();

  const [defaultValue] = useState(
    `import micropip
await micropip.install("cowsay")
import cowsay
cowsay.cow('hello world')`);

  useEffect(() => {
    const pyonideLoadingMessage = 'Python initialization complete';
    if (!pyodide) {
      loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.19.0/full/',
        stdout: (text) => {
          // if (!text.includes(pyonideLoadingMessage))
          outputRef.current.innerHTML += text + '\n'
        },
        stderr: (text) => {
          outputRef.current.innerHTML += text + '\n'
        }
      }).then(async p => {
        await p.loadPackage("micropip");
        setPyodide(p);
      }).catch((err) => {
        console.log('pyodide error:', err);
      });
    }
  }, [])

  async function runLocalPython(e) {
    outputRef.current.innerHTML = ''
    if (pyodide) {
      try {
        const value = editorRef.current.getValue();
        await pyodide.runPythonAsync(value);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  return (
    <div className="App" style={{ height: '100%' }}>
      <script src="https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js"></script>
      <Editor
        height={'400px'}
        width="100%"
        // defaultLanguage={language.name}
        language={'python'}
        defaultValue={defaultValue}
        // beforeMount={handleEditorWillMount}
        // onValidate={handleEditorValidation}
        // onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          // renderLineHighlightOnlyWhenFocus:true,
          // useShadowDOM:false,
          minimap: { enabled: false },
          padding: { bottom: "5px", top: "5px" },
          scrollBeyondLastLine: false,
          // overviewRulerLanes: 0,
          // fixedOverflowWidgets: true,
          automaticLayout: true,
          quickSuggestions: { other: true, comments: true, strings: true }
        }}
      />
      <div style={{ position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', top: 10, right: 10 }} onClick={runLocalPython}>▶️</div>
        <pre
          style={{
            backgroundColor: '#222222',
            width: '100%',
            height: '100%',
            whiteSpace: 'pre',
            fontFamily: 'monospace',
            textAlign: 'left',
            padding: '5px',
            color: 'lightgray',
            overflow: 'auto'
          }}>
          <code ref={outputRef} />
        </pre>
      </div>
    </div>
  );
}

export default App;
