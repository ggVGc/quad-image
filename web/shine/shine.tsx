import { h, Component, render } from 'preact';

import { User } from './user';
import { Images } from './images';
import { onFiles } from './files';

require('preact/debug');

class Storage {
  targetGallery: string | null;
  images: string[];

  constructor() {
    const pees = localStorage.getItem('quadpees');

    if (pees) {
      this.images = JSON.parse(pees);
    } else {
      this.images = [];
    }

    this.targetGallery = localStorage.getItem('gallery');
  }
}

export function init(element: HTMLElement) {
  render(<Shine />, element);
}

interface State {
  storage: Storage;
  dragging: boolean;
}

class Shine extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.setupDoc();

    this.state = {
      storage: new Storage(),
      dragging: false,
    };
  }
  render() {
    return (
      <div>
        <div id="menu">
          <p>
            <img id="user-button" src="user.svg" alt="user menu" />
          </p>
          <User />
        </div>
        <label id="form" for="realos" class={this.state.dragging ? 'dragover' : undefined} />
        <input
          type="file"
          multiple={true}
          id="realos"
          onInput={(e) => onFiles(e.target && (e.target as HTMLInputElement).files, 'picked files')}
        />
        <Images images={this.state.storage.images.map((id) => ({ id, code: 'image' }))} />
        <div id="tcs">
          <p>
            <a href="/terms/">T&amp;Cs</a>
          </p>
        </div>
      </div>
    );
  }

  error(message: string) {}

  setupDoc() {
    const doc = document.documentElement as HTMLElement;

    doc.onpaste = (e) => {
      e.preventDefault();
      onFiles(e.clipboardData && e.clipboardData.files, 'pasted content');
    };

    doc.ondrop = (e) => {
      e.preventDefault();
      this.setState({ dragging: false });
      if (e.dataTransfer) {
        onFiles(e.dataTransfer.files, 'dropped objects');
      } else {
        this.error("Something was dropped, but it didn't have anything inside.");
      }
    };

    doc.ondragenter = (e) => {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
      e.preventDefault();
    };

    doc.ondragover = (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
      this.setState({ dragging: true });
    };

    doc.ondragexit = doc.ondragleave = () => {
      this.setState({ dragging: false });
    };
  }
}
