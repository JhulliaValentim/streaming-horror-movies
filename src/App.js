import logo from './logo.svg';
import './App.css';

function App() {
  const site = "Horror Movies";
  return (
    <div className="App">
      <header className="App-header">
        <h1>{site}</h1>
        <button onClick={() => alert('clicou')}>
          Clique aqui
        </button>
      </header>
    </div>
  );
}

export default App;
