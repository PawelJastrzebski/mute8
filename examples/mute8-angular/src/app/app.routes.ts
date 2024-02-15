import { Routes } from '@angular/router';
import { CouterComponent } from './components/couter/couter.component';
import { AsyncComponent } from './components/async/async.component';

export const routes: Routes = [
  {
    path: "counter",
    component: CouterComponent
  },
  {
    path: "async",
    component: AsyncComponent
  }
];
