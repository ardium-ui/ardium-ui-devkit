import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArdiumClickOutsideDirective } from './click-outside.directive';

// Test Host Component
@Component({
  template: `
    <div ardClickOutside (ardClickOutside)="onOutside($event)" id="host">
      <span id="inside">Inside</span>
    </div>
  `,
  standalone: false,
})
class TestHostComponent {
  public event: MouseEvent | null = null;
  onOutside(event: MouseEvent) {
    this.event = event;
  }
}

describe('ArdiumClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let hostDebugElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArdiumClickOutsideDirective, TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostDebugElement = fixture.debugElement.query(
      By.directive(ArdiumClickOutsideDirective),
    );
  });

  it('should create the directive', () => {
    expect(hostDebugElement).toBeTruthy();
  });

  it('should emit when clicking outside the host element (mousedown)', () => {
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(component.event).toBe(event);

    document.body.removeChild(outsideElement);
  });

  it('should emit when clicking outside the host element (touchstart)', () => {
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('touchstart', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(component.event).toBe(event);

    document.body.removeChild(outsideElement);
  });

  it('should NOT emit when clicking inside the host element', () => {
    const insideElement = fixture.nativeElement.querySelector('#inside');
    const event = new MouseEvent('mousedown', { bubbles: true });

    insideElement.dispatchEvent(event);

    expect(component.event).toBeNull();
  });

  it('should NOT emit when clicking on the host element itself', () => {
    const hostElement = fixture.nativeElement.querySelector('#host');
    const event = new MouseEvent('mousedown', { bubbles: true });

    hostElement.dispatchEvent(event);

    expect(component.event).toBeNull();
  });

  it('should handle null target gracefully', () => {
    // Simulate the HostListener receiving a null target
    const directive: ArdiumClickOutsideDirective =
      hostDebugElement.injector.get(ArdiumClickOutsideDirective);
    expect(() =>
      directive.onClick(new MouseEvent('mousedown'), null as any),
    ).not.toThrow();
    expect(component.event).toBeNull();
  });
});
