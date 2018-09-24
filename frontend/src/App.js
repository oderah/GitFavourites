import React, { Component } from 'react'
import Favourites from './components/favourites/Favourites'
import Search from './components/search/Search'
import './App.css'

class App extends Component {
  constructor(props) {
      super(props)

      // refs
      this.favourites = React.createRef();
      this.search = React.createRef();
  }

  // this function triggers reload function of the children components
  trigger = () => {
    this.search.current.reload()
    this.search.current.query()
    this.favourites.current.reload()
  }
  
  render() {
    var headerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: '#4C647F'
    }
    return (
      <div className="App" style={{background: '#E5F1FF'}}>
        <header className="App-header" style={headerStyle}>
          <h1 className="title">My GitHub Favourites</h1>
        </header>
        <div id="appContainer">
          <Search trigger={this.trigger} ref={this.search} />
          <Favourites trigger={this.trigger} ref={this.favourites} />
        </div>
      </div>
    );
  }
}

export default App;
