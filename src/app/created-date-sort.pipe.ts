import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'createdDateSort'
})
export class CreatedDateSortPipe implements PipeTransform {

  transform(tickets: any[], sortDirection: any): any {
    function compare(a, b) {
      const dateA = a.date_created;
      const dateB = b.date_created;

      let comparison = 0;
      if (dateA > dateB) {
        comparison = 1;
      } else if (dateA < dateB) {
        comparison = -1;
      }
      return comparison;
    }
    let returnArray = tickets.sort(compare)
    return returnArray;
  }

}
