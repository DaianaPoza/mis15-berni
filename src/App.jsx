import "./App.css";
import Header from "./componentes/header/Header";
import Inforelevante from "./componentes/inforelevante/Inforelevante";
import Cuentaregresiva from "./componentes/cuentaregresiva/Cuentaregresiva";
import Regalo from "./componentes/regalo/Regalo";
import Confirmacion from "./componentes/confirmacion/Confirmacion";


function App() {
  return (
    <main className="app">
      <Header />
      <Inforelevante />
      <Cuentaregresiva />
      <Regalo />
<Confirmacion />
      
    </main>
  );
}

export default App;