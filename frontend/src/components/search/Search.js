import React, { Component } from "react"
import './Search.css'

const axios = require('axios')

 class Search extends Component {
    constructor(props) {
        super(props)

        this.state = {
          searched: false,
          result: false
        }
    }

    // this function queries the backend for repos
    query = (e) => {
      if (e) e.preventDefault()
      let self = this
      var keyword = document.getElementById('keyword')

      if (keyword.value !== "") {
        axios.post('http://localhost:7000/', {keyword: keyword.value})
        .then(res => {
          self.setState({
            queryResult: res.data.search.edges,
            result: (res.data.search.edges.length > 0) ? true : false,
            searched: true
          })
        })
        .catch(err => console.log(err))
      }
    }

    // this function maps repos to table rows
    mappedResults = (repo, id) => {

      // temp variables
      let nameWithOwner = repo.node.nameWithOwner
      let primaryLanguage = (repo.node.primaryLanguage) ? repo.node.primaryLanguage.name : '-'
      let releases = repo.node.releases.edges
      let tag = (releases.length > 0) ? releases[0].node.tag.name : '-'

      let isFav = this.find(repo)

      return (<tr key={id}><td width="40%"><a href={`http://github.com/${nameWithOwner}`} target="_blank">{nameWithOwner}</a></td><td>{primaryLanguage}</td><td>{tag}</td>{!isFav && <td width="10%"><button className="btn btn-primary" onClick={() => {this.add(nameWithOwner, primaryLanguage, tag)}}>{'Add'}</button></td>}{isFav && <td></td>}</tr>)
    }

    // this function clears the search result when the search input is empty
    reset = () => {
      var keyword = document.getElementById('keyword')
      if (keyword.value === "") this.setState({searched: false})
    }

    componentDidMount () {
      this.reload()
    }

    // this function determines if a repo is in favourites
    find = (toFind) => {
      for (var repo in this.favourites) {
        if (this.favourites[repo].Name === toFind.node.nameWithOwner) {
          return true
        }
      }

      return false
    }

    // this function adds a repo to favourites
    add = (name, language, tag) => {
      let self = this
      axios.post('http://localhost:7000/favourites', {name: name, language: language, tag: tag, request: 'add'})
      .then(res => {
        self.reload()
        self.query()
        self.props.trigger()
      })
      .catch(err => console.log(err))

    }

    // this function reloads the component
    reload = () => {
      axios.get('http://localhost:7000/favourites')
      .then(res => {
        this.favourites = res.data.data
      })
      .catch(err => console.log(err))
    }

    render() {
        return(
          <div id="search" style={{height: '80vh', background: '#B7C1CC', padding: '10px', margin: '5px 2.5px 5px 5px', overflow: 'scroll'}}>
            <br />
            <form className='form-inline'>
              <input id="keyword" type="text" className="form-control" onChange={this.reset} />
              <button className="btn btn-info" onClick={this.query}>search</button>
            </form>
            <br />
            <br />
            {this.state.searched && this.state.result && <table className="table">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Language</td>
                  <td>Tag</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {this.state.queryResult.map(this.mappedResults)}
              </tbody>
            </table>}
            {this.state.searched && !this.state.result && <h4 style={{fontStyle: 'italic', color: 'white', transform: 'translateY(25vh)'}}>Sorry, could not find any matches :(</h4>}
          </div>
        );
    }
}

export default Search
