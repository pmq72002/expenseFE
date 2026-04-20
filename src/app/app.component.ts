import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  isDark = false;

  ngOnInit() {
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') {
      this.isDark = true;
      document.body.classList.add('dark-theme');
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;

    if (this.isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
