import { h, Component } from 'preact';
import { SavedImage } from '../types';

export type MaybeImage = { code: 'image', id: SavedImage } | { code: 'loading' };

export interface Props {
  images: MaybeImage[];
}

export class Images extends Component<Props> {
  render(props) {
    return <ul id="images" />;
  }
}
