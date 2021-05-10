import { Component, Input, OnInit } from '@angular/core';
import { input } from '@aws-amplify/ui';

export interface IGaugeData {
  Min: number;
  Max: number;
  Value: number;
}

@Component({
  selector: 'app-dash-gauge',
  templateUrl: './dash-gauge.component.html',
  styleUrls: ['./dash-gauge.component.scss']
})
export class DashGaugeComponent implements OnInit {
  @Input() public GaugeData: IGaugeData;

  constructor() { }

  public needle_pointer() {
    const data = this.GaugeData;
    const rotation = 180 * (data.Value / (data.Max - data.Min));
    return this.getPoints(rotation);
  }

  ngOnInit(): void {
  }

  public getPoints(rotation) {
    const c = { width: 138, r: 6 };

    const rotate = (s, angle) => {
      const a = (s.a - angle) * (Math.PI / 180);
      return {
        x: c.width / 2 + s.r * Math.cos(a),
        y: c.width / 2 - s.r * Math.sin(a)
      };
    };

    const p1 = rotate({r: 53, a: 180}, rotation);
    const p2 = rotate({r: 6, a: 90}, rotation);
    const p3 = rotate({r: 6, a: 270}, rotation);

    return `${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
  }

}
