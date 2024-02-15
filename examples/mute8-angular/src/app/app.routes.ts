import { Routes } from '@angular/router';
import { AsyncComponent } from './components/async/async.component';
import { CounterComponent } from './components/counter/counter.component';

export const routes: Routes = [
  {
    path: "",
    component: CounterComponent
  },
  {
    path: "counter",
    component: CounterComponent
  },
  {
    path: "async",
    component: AsyncComponent
  }
];
