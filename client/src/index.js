import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Text extends React.Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    titles: '',
    text: ''
  }

  componentDidMount() {
    this.callApi()
      .then((res) => this.setState({ response: res.express }))
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/');
    const body = await response
    if (response.status !== 200) { throw new Error(body.message) }
    console.log(response)
    return body;
  };

  
render() {
    //console.log(this.state.response)
    return (
      <div className="App">
      <p>rendering..</p>
        <p>{this.state.response}</p>
        {/* <form onSubmit={this.handleSubmit}> */}
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        {/* </form> */}
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

ReactDOM.render(<Text />, document.getElementById('root'))


