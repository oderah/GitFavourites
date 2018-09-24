import React, { Component } from "react"
import './Favourites.css'

const axios = require('axios')

 class Favourites extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favourites: [], // holds the list of favourite repos
      hasFavourites: false // control for favourites
    }
  }

  // this funtion maps favourite repos to table rows
  mappedFavourites = (repo, id) => {
    return (<tr key={id}><td width="40%"><a href={`http://github.com/${repo.Name}`} target="_blank">{repo.Name}</a></td><td>{repo.Language}</td><td>{repo.Tag}</td><td width="10%"><button className="btn btn-danger" onClick={() => {this.remove(repo)}}>{'Remove'}</button></td></tr>)
  }

  componentDidMount () {
    this.reload()
  }

  // this function removes a repo from favourites
  remove = (repo) => {
    let self = this

    axios.post('http://localhost:7000/favourites', {name: repo.Name, request: 'remove'})
    .then(res => {
      self.reload()
      self.props.trigger()
    })
    .catch(err => console.log(err))
  }

  // this function reloads the favourite repos
  reload = () => {
    let self = this

    axios.get('http://localhost:7000/favourites')
    .then(res => {
      self.setState({
        favourites: res.data.data,
        hasFavourites: (res.data.data.length > 0) ? true : false
      })
    })
    .catch(err => console.log(err))
  }

  render() {
    return(
      <div id="favourites" style={{height: '80vh', width: '100%', background: '#72797F', overflow: 'scroll', margin: '5px 5px 5px 2.5px'}}>
        {this.state.hasFavourites && <table className="table table-dark">
          <thead>
            <tr>
              <td>Name</td>
              <td>Language</td>
              <td>Tag</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {this.state.favourites.map(this.mappedFavourites)}
          </tbody>
        </table>}
        {!this.state.hasFavourites && <h4 style={{fontStyle: 'italic', color: '#B7C1CC', transform: 'translateY(25vh)'}}>You do not have any favourite repositories</h4>}
      </div>
    );
  }
}

export default Favourites
