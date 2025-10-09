import './Navbar.css';

function Navbar() {
  const site = "Horror Movies";
  return (
    <div className="Nav">
      <nav className="Nav-bar">
        <section className='Nav-section'>
          <h1 className='title'>{site}</h1>
        </section>
        <section className='Nav-section'>
          <ol className='nav-buttons'>
            <li>Home</li>
            <li>Minha Lista</li>
            <li>Categorias</li>
          </ol>
        </section>
      </nav>
    </div>
  );
}

export default Navbar;
