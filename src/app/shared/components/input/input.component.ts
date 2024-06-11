import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() public required?: boolean;

  @Input()
  public set value(value: string | number | undefined | null) {
    if (value === undefined || value === null) {
      this._value = '';
      this.onChange?.('');
      return;
    }
    if (value !== this._value) {
      this._value = `${value}`;
      this.onChange?.(`${value}`);
    }
  }

  public get value(): string {
    return this._value;
  }

  private _value = '';

  public get control(): FormControl | undefined {
    return <FormControl<unknown>>this._ngControl?.control;
  }

  public get isRequired(): boolean {
    const hasRequiredValidator = !!(
      this.control?.hasValidator(Validators.required) && this.required !== false
    );
    return this.required || hasRequiredValidator;
  }
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(@Self() @Optional() private readonly _ngControl?: NgControl) {
    if (this._ngControl) {
      this._ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
