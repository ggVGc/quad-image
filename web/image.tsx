import { h, Component } from 'preact';
import { SavedImage } from './types';

export interface Props {
  id: SavedImage;
}

class Image extends Component<Props> {
  render(props: Props) {
    return (
      <li data-mini-url={props.id} class="loaded">
        <button>copy</button>
        <button>🗑➡️</button>
        <a href={props.id} target="_blank">
          <img src={`${props.id}.thumb.jpg`} />
        </a>
      </li>
    );
  }
}
