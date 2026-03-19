import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  template: `
    <form [formGroup]="form">
      <input id="nameInput" formControlName="name" appUppercase />
    </form>
  `,
  imports: [ReactiveFormsModule, UppercaseDirective],
})
class TestHostComponent {
  form = new FormGroup({ name: new FormControl('') });
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    inputEl = fixture.nativeElement.querySelector('#nameInput');
  });

  it('should create directive', () => {
    // Assert
    expect(host).toBeTruthy();
  });

  it('should convert input value to uppercase on input event', () => {
    // Arrange
    inputEl.value = 'spider-man';

    // Act
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(inputEl.value).toBe('SPIDER-MAN');
  });

  it('should update the bound FormControl with the uppercase value', () => {
    // Arrange
    inputEl.value = 'batman';

    // Act
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(host.form.get('name')!.value).toBe('BATMAN');
  });

  it('should leave an already-uppercase value unchanged', () => {
    // Arrange
    inputEl.value = 'FLASH';

    // Act
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(inputEl.value).toBe('FLASH');
    expect(host.form.get('name')!.value).toBe('FLASH');
  });

  it('should handle numbers and special characters without error', () => {
    // Arrange
    inputEl.value = 'hero-42!';

    // Act
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(inputEl.value).toBe('HERO-42!');
    expect(host.form.get('name')!.value).toBe('HERO-42!');
  });

  it('should handle empty string without error', () => {
    // Arrange
    inputEl.value = '';

    // Act
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(inputEl.value).toBe('');
    expect(host.form.get('name')!.value).toBe('');
  });
});
