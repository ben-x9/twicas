import { Store } from 'root';
import { newStore as card } from 'components/card';

export const store: Store = {
  cards: [
    card({front: 'eat', back: '食べる'}),
    card({front: 'drink', back: '飲む'}),
    card({front: 'sleep', back: '寝る'}),
    card({front: 'wake up', back: '起きる'}),
  ],
};