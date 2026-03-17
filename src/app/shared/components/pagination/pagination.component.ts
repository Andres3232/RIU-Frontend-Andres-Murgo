import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = 1
  totalPages = 10

  pageChange = output<number>();



  pages = () => {
    const total = this.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  };
}
