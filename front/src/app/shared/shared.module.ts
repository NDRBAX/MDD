import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ButtonComponent } from './components/button/button.component';
import { AlertComponent } from './components/alert/alert.component';
import { StatusMessageComponent } from './components/status-message/status-message.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TruncateTextDirective } from './directives/truncateText.directive';
import { IconTypePipe } from './pipes/icon-type.pipe';
import { StatusColorPipe } from './pipes/status-color.pipe';
import { LogoComponent } from './components/logo/logo.component';
import { RouterModule } from '@angular/router';
import { TopicCardComponent } from './components/topic-card/topic-card.component';
import { GoBackButtonComponent } from './components/go-back-button/go-back-button.component';

@NgModule({
  declarations: [
    ButtonComponent,
    AlertComponent,
    StatusMessageComponent,
    SpinnerComponent,
    TruncateTextDirective,
    IconTypePipe,
    StatusColorPipe,
    LogoComponent,
    TopicCardComponent,
    GoBackButtonComponent
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    MaterialModule,
    ButtonComponent,
    AlertComponent,
    StatusMessageComponent,
    SpinnerComponent,
    TruncateTextDirective,
    IconTypePipe,
    StatusColorPipe,
    LogoComponent,
    TopicCardComponent,
    GoBackButtonComponent
  ],
})
export class SharedModule {}
