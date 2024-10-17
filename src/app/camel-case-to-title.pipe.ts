import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToTitle'
})
export class CamelCaseToTitlePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Add a space before each uppercase letter that is not at the start of the string
    let titleCase = value.replace(/([a-z])([A-Z])/g, '$1 $2')
                         .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

    // Capitalize the first letter of each word and ensure lowercase letters after uppercase clusters are handled
    titleCase = titleCase.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');

    return titleCase;
  }
}
