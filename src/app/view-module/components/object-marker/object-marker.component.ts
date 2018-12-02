import {Component, Input, OnInit} from '@angular/core';
import {MarkerInfo} from './marker-info';

@Component({
  selector: 'object-marker',
  templateUrl: './object-marker.component.html',
  styleUrls: ['./object-marker.component.scss']
})
export class ObjectMarkerComponent implements OnInit {

  @Input()
  markerInfo: MarkerInfo;

  constructor() { }

  ngOnInit() {
  }

}
