import {Product} from './services/menu.service';

export interface Order {
  id?: string;
  date: string;
  client: { id: string };
  products: Product[];
}
