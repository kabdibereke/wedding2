import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrService } from 'ngx-toastr';
import { uuidv7 } from 'uuidv7';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { DividerComponent } from '../../../shared/components/divider/divider.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectButtonComponent } from '../../../shared/components/select-button/select-button.component';
import { TextAreaComponent } from '../../../shared/components/text-area/text-area.component';
import { ScrollAnimationDirective } from '../../../shared/directives/scroll-animation.directive';
import { GuestService } from '../../services/main-page.service';
import { GuestType } from './main-page.types';
@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',

  imports: [
    DividerComponent,
    AngularSvgIconModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    TextAreaComponent,
    SelectButtonComponent,
    ReactiveFormsModule,
    ScrollAnimationDirective,
    TranslateModule,
  ],
})
export class MainPageComponent implements OnInit {
  @ViewChild('audio', { static: true })
  public audioRef: ElementRef<HTMLAudioElement>;
  public isPlaying: boolean = false;
  public noTranslation: string;
  public yesTranslation: string;
  public targetDate = new Date('July 7, 2024 16:00:00').getTime();
  public days: string;
  public hours: string;
  public minutes: string;
  public seconds: string;
  public interval: any;
  public selectedOption: string;
  public loading = false;
  public formErrorText: string;
  public formSuccessText: string;
  public form = this._fb.group({
    name: this._fb.nonNullable.control<string>('', [Validators.required]),
    wishes: this._fb.nonNullable.control<string>('', [Validators.required]),
  });

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _guestService: GuestService,
    private readonly _translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.interval = setInterval(() => {
      this.updateCountdown();
    }, 1000);

    this._translate.get('YES').subscribe((yesTranslation: string) => {
      this.yesTranslation = yesTranslation;
      this.selectedOption = yesTranslation
    });

    this._translate.get('NO').subscribe((noTranslation: string) => {
      this.noTranslation = noTranslation;
    });

    this._translate.get('FORM_ERROR').subscribe((yesTranslation: string) => {
      this.formErrorText = yesTranslation;
    });

    this._translate.get('FORM_SUCCESS').subscribe((noTranslation: string) => {
      this.formSuccessText = noTranslation;
    });
  }

  public ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  public optionSelected(event: string) {
    this.selectedOption = event;
  }

  public updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.days = days.toString().padStart(2, '0');
    this.hours = hours.toString().padStart(2, '0');
    this.minutes = minutes.toString().padStart(2, '0');
    this.seconds = seconds.toString().padStart(2, '0');

    if (distance < 0) {
      clearInterval(this.interval);
      this.days = '00';
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';
    }
  }

  public goToMap(): void {
    window.open(
      'https://2gis.kz/kokshetau/firm/70000001061172032?m=71.873769%2C52.352327%2F16.41',
      '_blank'
    );
  }

  public sendForm(): void {
    if (this.form.invalid) {
      this._toastr.error(this.formErrorText, '', {
        timeOut: 3000,
      });
      return;
    }
    this.loading = true;
    
    setTimeout(()=> {
      const formValue = (this.form.controls.name.value as string).split(',');

      if (formValue.length == 1) {
         console.log(this.selectedOption)
        const request = {
          id: uuidv7(),
          name: this.form.controls.name.value,
          wishes: this.form.controls.wishes.value,
          isComing:
            this.selectedOption === 'Иә' || this.selectedOption ===  'Да' 
              ? true
              : false,
        };
  
        this._guestService
          .addGuest(request as unknown as GuestType)
          .subscribe(() => {
            this.loading = false;
            this.form.reset();
            this._toastr.error(this.formSuccessText, '', {
              timeOut: 3000,
            });
          });
      }
  
      if (formValue.length > 1) {
        const mappedValue = formValue.map((value) => {
          return {
            id: uuidv7(),
            name: value.trim(),
            wishes: this.form.controls.wishes.value,
            isComing:
            this.selectedOption === 'Иә' || this.selectedOption ===  'Да' 
            ? true
            : false,
          };
        });
  
        this._guestService
          .addGuestList(mappedValue as unknown as GuestType[])
          .subscribe(() => {
            this.loading = false;
            this.form.reset();
            this._toastr.error(this.formSuccessText, '', {
              timeOut: 3000,
            });
          });
      }
    },100)
  }

  public play() {
    this.audioRef.nativeElement.play();
    this.isPlaying = true;
  }

  public pause() {
    this.audioRef.nativeElement.pause();
    this.isPlaying = false;
  }

  public switchLanguage(lang: string) {
    this._translate.use(lang === 'Қаз' ? 'kz' : 'ru');
    this._translate.get('YES').subscribe((yesTranslation: string) => {
      this.yesTranslation = yesTranslation;
    });

    this._translate.get('NO').subscribe((noTranslation: string) => {
      this.noTranslation = noTranslation;
    });

    this._translate.get('FORM_ERROR').subscribe((yesTranslation: string) => {
      this.formErrorText = yesTranslation;
    });

    this._translate.get('FORM_SUCCESS').subscribe((noTranslation: string) => {
      this.formSuccessText = noTranslation;
    });
  }

  public goToTg(): void {
    window.open('https://t.me/+9NKiCSlRKXQ1NDc6', '_blank');
  }
}
