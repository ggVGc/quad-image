import { h, Component, render } from 'preact';

import { User } from './user';
import { Images } from './images';

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
}

class Shine extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      storage: new Storage(),
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
        <label for="realos" id="form"></label>
        <input type="file" multiple id="realos" />
        <Images images={this.state.storage.images.map((id) => ({ id, code: 'image' }))} />
        <div id="tcs">
          <p>
            <a href="/terms/">T&amp;Cs</a>
          </p>
        </div>
      </div>
    );
  }
}
