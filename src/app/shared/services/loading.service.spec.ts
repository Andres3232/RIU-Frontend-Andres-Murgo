import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should set isLoading to true', () => {
      // Act
      service.show();

      // Assert
      expect(service.isLoading()).toBe(true);
    });
  });

  describe('hide', () => {
    it('should set isLoading to false when no more active requests', () => {
      // Arrange
      service.show();

      // Act
      service.hide();

      // Assert
      expect(service.isLoading()).toBe(false);
    });

    it('should keep isLoading true when there are still active requests', () => {
      // Arrange
      service.show();
      service.show(); // 2 active requests

      // Act
      service.hide(); // 1 still active

      // Assert
      expect(service.isLoading()).toBe(true);
    });

    it('should set isLoading to false when all requests are done', () => {
      // Arrange
      service.show();
      service.show();

      // Act
      service.hide();
      service.hide();

      // Assert
      expect(service.isLoading()).toBe(false);
    });

    it('should not go below zero active requests', () => {
      // Act
      service.hide();
      service.hide();

      // Assert
      expect(service.isLoading()).toBe(false);
    });
  });
});
