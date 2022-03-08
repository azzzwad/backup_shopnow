import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  gridview: boolean;
  listview: boolean = true;
  twogridview: boolean;
  threegridview: boolean;
  fourgridview: boolean;

  constructor() {}

  ngOnInit(): void {}

  gridView() {}

  listView() {
    this.gridview = false;
    this.twogridview = false;
    this.threegridview = false;
    this.fourgridview = false;
    this.listview = true;
  }
  twoGridView() {
    this.gridview = true;
    this.listview = false;
    this.threegridview = false;
    this.fourgridview = false;
    this.twogridview = true;
  }
  threeGridView() {
    this.gridview = true;
    this.listview = false;
    this.twogridview = false;
    this.fourgridview = false;
    this.threegridview = true;
  }
  fourGridView() {
    this.gridview = true;
    this.listview = false;
    this.twogridview = false;
    this.threegridview = false;
    this.fourgridview = true;
  }
}
