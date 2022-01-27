import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {
    const pyonideLoadingMessage = 'Python initialization complete';
    if (!pyodide && props.local) {
      // console.log('loading pyodide...');
      globalThis.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
        stdout: (text) => {
          if (!text.includes(pyonideLoadingMessage)) {
            console.log('setting output to true...');
            if (!output) setOutput(true);
            return (document.getElementById('output').textContent += text + '\n')
          }
        },
        stderr: (text) => {
          if (!output) setOutput(true);
          return (document.getElementById('output').textContent += text + '\n')
        }
      }).then(async p => {
        await p.loadPackage("micropip");
        setPyodide(p);
      }).catch((err) => {
        console.log('pyodide error:', err);
      });
    }

  }, [monaco])

  async function runLocalPython(e) {
    if (document.getElementById('output')) document.getElementById('output').textContent = '';
    if (pyodide) {
      try {
        const value = editorRef.current.getValue();
        await pyodide.runPythonAsync(value);

      } catch (error) {
        console.log(error);
      }

    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
