import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { escapeHTML } from '../escape-html/escape-html';
import { ArdiumInnerHTMLDirective } from './inner-html.directive';

// Mock the escapeHTML function
jest.mock('../escape-html/escape-html', () => ({
  escapeHTML: jest.fn((value: string) => `escaped: ${value}`),
}));

@Component({
  template: `<div
    [ardInnerHTML]="content"
    [ardEscapeInnerHTML]="escape"
  ></div>`,
})
class TestComponent {
  content = '<b>Test</b>';
  escape = false;
}

describe('ArdiumInnerHTMLDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ArdiumInnerHTMLDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.query(
      By.directive(ArdiumInnerHTMLDirective),
    ).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance of ArdiumInnerHTMLDirective', () => {
    const directive = fixture.debugElement
      .query(By.directive(ArdiumInnerHTMLDirective))
      .injector.get(ArdiumInnerHTMLDirective);
    expect(directive).toBeTruthy();
  });

  it('should set innerHTML without escaping when ardEscapeInnerHTML is false', () => {
    component.content = '<b>Test</b>';
    component.escape = false;
    fixture.detectChanges();

    expect(element.innerHTML).toBe('<b>Test</b>');
    expect(escapeHTML).not.toHaveBeenCalled();
  });

  it('should escape innerHTML when ardEscapeInnerHTML is true', () => {
    component.content = '<b>Test</b>';
    component.escape = true;
    fixture.detectChanges();

    expect(element.innerHTML).toBe('escaped: <b>Test</b>');
    expect(escapeHTML).toHaveBeenCalledWith('<b>Test</b>');
  });

  it('should update innerHTML when content changes', () => {
    component.content = '<i>New Content</i>';
    fixture.detectChanges();

    expect(element.innerHTML).toBe('<i>New Content</i>');
  });

  it('should update escaped innerHTML when content changes and escaping is enabled', () => {
    component.content = '<i>New Content</i>';
    component.escape = true;
    fixture.detectChanges();

    expect(element.innerHTML).toBe('escaped: <i>New Content</i>');
  });

  it('should update innerHTML when escaping option changes', () => {
    component.content = '<b>Test</b>';
    component.escape = false;
    fixture.detectChanges();

    expect(element.innerHTML).toBe('<b>Test</b>');

    component.escape = true;
    fixture.detectChanges();

    expect(element.innerHTML).toBe('escaped: <b>Test</b>');
  });
});
