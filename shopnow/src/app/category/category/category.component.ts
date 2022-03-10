import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  // Product View Handle
  gridview: boolean;
  listview: boolean = true;
  twogridview: boolean;
  threegridview: boolean;
  fourgridview: boolean;

  // Price Range
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;
  tickInterval = 1;

  constructor() {}

  ngOnInit(): void {}
  // product view handle functions
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

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }
}
