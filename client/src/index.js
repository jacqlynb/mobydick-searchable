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
    // this.formatText = this.formatText.bind(this);
  }

  componentDidMount() {
    this.fetchChapters()
      .then(chapters => {
        this.setState({
          chapters, 
          title: chapters[0].title,
          text: chapters[0].text
        });
      })
      .catch((err) => console.log(err));
  }

  renderChapterTitles(chapter) {
    const shouldHighlight = this.state.titlesToHighlight.includes(chapter.title.trim());
    const currentTitle = this.state.title.includes(chapter.title);
    
    let classIdentifier;
    if (shouldHighlight && currentTitle) { classIdentifier = 'currentTitleHighlighted' }
    else if (currentTitle && !shouldHighlight) { classIdentifier = 'currentTitle' }
    else if (!currentTitle && shouldHighlight) { classIdentifier = 'titleHighlighted' }
    else { classIdentifier = null }

    return (
      <a
        key={chapter.idNumerical}
        onClick={this.handleClick.bind(this, chapter)}
        className={classIdentifier}>
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

      const textFormatted = this.state.text.split("\r \r").join("\n\n")
      console.log(textFormatted);
      const textMarkup = 
        <div className="chapterText">
          <Highlighter
            highlightClassName="highlight"
            searchWords={this.state.searchWords}
            autoEscape={true}
            textToHighlight={textFormatted}
          />
        </div>

    return (
      <div className="App">
        {chaptersMarkup}
        <div className="mainText">
          <div className="titles">
            <p className="bookTitle">Moby Dick</p>
            <img src={logo}/>
            <p className="mainTextTitle">Chapter {this.state.title.replace('.', ':').replace('.', '')}</p>
          </div>
          {textMarkup}
        </div>
        <p>{this.state.responseToPost}</p>
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
