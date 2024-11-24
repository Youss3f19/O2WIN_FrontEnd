import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo',
  standalone: true
})
export class DaysAgoPipe implements PipeTransform {

  transform(value: Date | undefined ): string {
    if (!value) return 'Invalid date';

    const inputDate = new Date(value);
    if (isNaN(inputDate.getTime())) return 'Invalid date';

    const now = new Date();
    const diffInMs = now.getTime() - inputDate.getTime();

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays === 0
      ? 'Today'
      : diffInDays === 1
      ? 'Yesterday'
      : `${diffInDays} days ago`;
  }
}
