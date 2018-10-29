/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@sac/table';

import { Person, DemoDataSource } from '@sac/demo-apps/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .build();

@Component({
  selector: 'sac-transpose-table-example-component',
  templateUrl: './transpose.component.html',
  styleUrls: ['./transpose.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransposeTableExampleComponent {

  columns = COLUMNS;
  transposeToggle = false;

  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 25) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @sac-example:ex-3 */
/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
