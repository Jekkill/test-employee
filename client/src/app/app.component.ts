import {Component, OnInit} from '@angular/core';

type Link = {
  title: string,
  url: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employees';
  links: Link[] = [];
  activeLink = "";

  ngOnInit(): void {
    this.links = [
      { title: 'Employees', url : 'employees' },
      { title: 'Offices', url : 'offices' },
      { title: 'Tags', url : 'tags' },
    ];
    this.activeLink = this.links[0].url;
  }
}
