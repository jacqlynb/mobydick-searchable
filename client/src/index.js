import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Text extends React.PureComponent {
  state = {
    response: null,
    post: '',
    responseToPost: '',
    title: '',
    text: '',
    idNumerical: 0
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderChapterTitles = this.renderChapterTitles.bind(this);
  }

  componentDidMount() {
    this.fetchChapters()
      .then(chapters => {
        this.setState({chapters});
      })
      .catch((err) => console.log(err));
  }

  renderChapterTitles(chapter) {
    return <a key={chapter.idNumerical} onClick={this.handleClick.bind(this, chapter)}>{chapter.title}</a>;
  }
  
  handleClick(chapter) {
    console.log(chapter.title);
    console.log(chapter.text);
    this.setState({text: chapter.text});
  }
  
  render() {
    const {chapters} = this.state;

    const chaptersMarkup = chapters == null ? null : 
      <div className="chapterTitles">
        <p className="bookTitle">Moby Dick</p>
        <p className="tableOfContents">Table of Contents</p>
        {chapters.map(this.renderChapterTitles)}
      </div>;

    return (
      <div className="App">
        {chaptersMarkup}
        
        <div className="mainText">
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Search for:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit" className="submitButton">Submit</button>
        </form>
        <div className="chapterText">{this.state.text}</div>
        </div>
        {/* <p>{this.state.responseToPost}</p> */}
      </div>
    );
  }

  fetchChapters = async () => {
    try {
      const chapters = await fetch('/mobydick');
      return chapters.json();
    } catch(error) {
      console.log('Error in callApi', error);
    }
  };

  handleSubmit = async e => {    
    e.preventDefault();    
    const response = await fetch('/', {      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      
      body: JSON.stringify({ post: this.state.post }),   
    })
    const body = await response.text()
    this.setState({ responseToPost: body })
  }  
}

ReactDOM.render(<Text />, document.getElementById('root'))


