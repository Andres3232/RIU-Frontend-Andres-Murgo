import { TestBed } from '@angular/core/testing';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start on page 1', () => {
      expect(service.currentPage()).toBe(1);
    });

    it('should start with 0 total items', () => {
      expect(service.totalItems()).toBe(0);
    });

    it('should have default items per page', () => {
      expect(service.itemsPerPage()).toBe(3);
    });
  });

  describe('setTotalItems', () => {
    it('should update total items', () => {
      // Arrange
      const total = 20;

      // Act
      service.setTotalItems(total);

      // Assert
      expect(service.totalItems()).toBe(20);
    });

    it('should compute total pages correctly', () => {
      // Arrange — 10 items, 3 per page

      // Act
      service.setTotalItems(10);

      // Assert
      expect(service.totalPages()).toBe(4);
    });

    it('should adjust currentPage if it exceeds totalPages', () => {
      // Arrange
      service.setTotalItems(30);
      service.setPage(10);

      // Act
      service.setTotalItems(3);

      // Assert
      expect(service.currentPage()).toBe(1);
    });
  });

  describe('setPage', () => {
    it('should change current page', () => {
      // Arrange
      service.setTotalItems(30);

      // Act
      service.setPage(3);

      // Assert
      expect(service.currentPage()).toBe(3);
    });

    it('should not set page below 1', () => {
      // Arrange
      service.setTotalItems(30);

      // Act
      service.setPage(0);

      // Assert
      expect(service.currentPage()).toBe(1);
    });

    it('should not set page above totalPages', () => {
      // Arrange
      service.setTotalItems(9);

      // Act
      service.setPage(99);

      // Assert
      expect(service.currentPage()).toBe(1);
    });
  });

  describe('nextPage', () => {
    it('should increment page by 1', () => {
      // Arrange
      service.setTotalItems(30);
      service.setPage(1);

      // Act
      service.nextPage();

      // Assert
      expect(service.currentPage()).toBe(2);
    });

    it('should not go past total pages', () => {
      // Arrange
      service.setTotalItems(3);
      service.setPage(1);

      // Act
      service.nextPage();

      // Assert
      expect(service.currentPage()).toBe(1);
    });
  });

  describe('prevPage', () => {
    it('should decrement page by 1', () => {
      // Arrange
      service.setTotalItems(30);
      service.setPage(3);

      // Act
      service.prevPage();

      // Assert
      expect(service.currentPage()).toBe(2);
    });

    it('should not go below page 1', () => {
      // Arrange
      service.setTotalItems(30);
      service.setPage(1);

      // Act
      service.prevPage();

      // Assert
      expect(service.currentPage()).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset to page 1', () => {
      // Arrange
      service.setTotalItems(30);
      service.setPage(5);

      // Act
      service.reset();

      // Assert
      expect(service.currentPage()).toBe(1);
    });
  });
});
