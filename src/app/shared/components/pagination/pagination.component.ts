import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
  computed,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  pageChange = output<number>();

  activePage = linkedSignal(this.currentPage);

  pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });
}
