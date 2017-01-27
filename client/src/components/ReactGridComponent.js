import React, {Component} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import RichEditor from '../containers/RichEditor';
import { EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import Client from '../Client';
import {stateToHTML} from 'draft-js-export-html';
var FontAwesome = require('react-fontawesome');


class ReactGridComponent extends Component {

  constructor(props) {
      super(props);
      var cards = [];
      var layout = {lg:[
          {i: '324', x: 2, y: 0, w: 1, h: 1},
          {i: 'ID201701262221431656', x: 1, y: 0, w: 1, h: 1},
          {i: 'c', x: 2, y: 0, w: 1, h: 1},
          {i: 'd', x: 0, y: 1, w: 1, h: 1},
          {i: 'e', x: 1, y: 1, w: 1, h: 1},
          {i: 'f', x: 2, y: 1, w: 1, h: 1},
      ]};
      Client.getCards((response) => {
          this.setState({cards: response});
      });
      Client.getLayout((response) => {
          this.setState({layout: {lg: JSON.parse(response)}});
      });
      this.state = {
          contentState: EditorState.createEmpty().getCurrentContent(),
          open: false,
          isShowingModal: false,
          cards: cards,
          layout: layout,
          activeCard: "0"
      };
  }

  handleOpen = (key) => {
      this.setState({isShowingModal: true})
      this.state.cards.forEach((card) => {
        if(card.key == key) {
            this.state.contentState = EditorState.createWithContent(convertFromRaw(JSON.parse(card.value))).getCurrentContent();
        }
      });
      this.state.activeCard = key;
  };

  handleClose = () => {
    this.setState({isShowingModal: false})
    this.state.contentState = this.refs.editor.getContentState();
    Client.updateCard(JSON.stringify(convertToRaw(this.state.contentState)), this.state.activeCard);
    this.updateCardBoard();
  };

  updateCardBoard = () => {
      Client.getCards((response) => {
          this.setState({cards: response});
      });
  };

  getContent = () => {
    const cardItems = this.state.cards.map((card) =>
        <div className="module" key={card.key} onClick={this.handleOpen}><div className="card-module">{JSON.parse(card.value)}</div></div>
    );
    return cardItems;
  };

  saveLayout = (layout) => {
      Client.saveLayout(JSON.stringify(layout));
  };

  getLayout = () => {
      return this.state.layout;
  };

  newCard = () => {
    Client.saveNewCard(JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())), (response) => {
        this.updateCardBoard();
    })
  };

  deleteCard = () => {
    Client.deleteCard(this.state.activeCard);
    this.setState({isShowingModal: false})
    this.updateCardBoard();
  };

  render() {
    return (
      <div>
      <ResponsiveReactGridLayout className="layout" layouts={this.getLayout()}
        breakpoints={{lg: 1200, md: 996, sm: 768}}
        cols={{lg: 3, md: 2, sm: 1}}
        onLayoutChange={(layout) => this.saveLayout(layout)}
        >
          {this.state.cards.map((card) =>
              <div className="module" key={card.key} onClick={this.handleOpen.bind(this, card.key)}><div className="card-module" dangerouslySetInnerHTML={{__html: stateToHTML(convertFromRaw(JSON.parse(card.value)))}}></div></div>
          )}
        </ResponsiveReactGridLayout>
        <div onClick={this.handleOpen}>
          {
            this.state.isShowingModal &&
            <ModalContainer onClose={this.handleClose}>
              <ModalDialog onClose={this.handleClose} style={{padding: "0"}}>
                <FontAwesome onClick={this.deleteCard} name='trash' size='2x' className='delete-button' />
                <div className="editor-wrap">
                  <RichEditor ref="editor" contentState={this.state.contentState}/>
                </div>
              </ModalDialog>
            </ModalContainer>
          }
        </div>
        <button onClick={this.newCard}>ADD CARD</button>
      </div>
    )
  }
};

export default ReactGridComponent;
