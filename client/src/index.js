import React from 'react';
import ReactDOM from 'react-dom';
import Highlighter from 'react-highlight-words';
import './index.css';
import logo from './assets/whale.png';

class Text extends React.PureComponent {
  state = {
    response: null,
    post: '',
    responseToPost: '',
    title: '',
    text: '',
    idNumerical: 0,
    searchWords: [],
    titlesToHighlight: [],
    chapters: null
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderChapterTitles = this.renderChapterTitles.bind(this);
  }

  componentDidMount() {
    this.fetchChapters()
      .then(chapters => {
        this.setState({
          chapters, 
          title: chapters[0].title,
          text: chapters[0].text
        });
        console.log(chapters)
      })
      .catch((err) => console.log(err));
  }

  renderChapterTitles(chapter) {
    const shouldHighlight = this.state.titlesToHighlight.includes(chapter.title.trim())
    return (
      <a
        key={chapter.idNumerical}
        onClick={this.handleClick.bind(this, chapter)}
        className={shouldHighlight ? 'highlight' : null}>
        Chapter {chapter.title.replace('.', ':').replace('.', '')}
      </a>
    );
  }
  
  handleClick(chapter) {
    this.setState({
      title: chapter.title,
      text: chapter.text
    });
  }
  
  render() {
    const {chapters} = this.state;
    const chaptersMarkup = chapters == null ? null : 
      <div className="chapterTitles">
        <p className="tableOfContents">Search the text:</p>
        <form onSubmit={this.handleSubmit} className="chapterSearch">
          <input type="text" 
                 value={this.state.searchWords} 
                 onChange={(e) => this.setState({ searchWords: e.target.value.split(',').map(word => word.trim()) })}
          />
          <button type="submit">Submit</button>
        </form>
        {chapters.map(this.renderChapterTitles)}
      </div>;

    return (
      <div className="App">
        {chaptersMarkup}
        <div className="mainText">
          <div className="titles">
            <p className="bookTitle">Moby Dick</p>
            <img src={logo}/>
            <p className="mainTextTitle">Chapter {this.state.title.replace('.', ':').replace('.', '')}</p>
          </div>
          <div className="chapterText">
            <Highlighter
              highlightClassName="highlight"
              searchWords={this.state.searchWords}
              autoEscape={true}
              textToHighlight={this.state.text}
            />
          </div>
        </div>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }

  fetchChapters = async () => {
    try {
      const chapters = await fetch('/mobydick');
      return chapters;
    } catch(error) {
      console.log('Error in callApi', error);
    }
  };

  handleSubmit = async e => {    
    e.preventDefault();    
    const response = await fetch('/mobydick-search', {      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      
      body: JSON.stringify({ post: this.state.searchWords }),   
    })
    const body = await response.text()
    this.setState({ titlesToHighlight: body })
  }  
}

ReactDOM.render(<Text />, document.getElementById('root'))


// line 112 prevoiusly 
// body: JSON.stringify({ post: this.state.searchWords }),  