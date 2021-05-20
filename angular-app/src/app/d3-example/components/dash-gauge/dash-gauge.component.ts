import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export interface IGaugeData {
  Min: number;
  Max: number;
  Value: number;
}

@Component({
  selector: 'app-dash-gauge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dash-gauge.component.html',
  styleUrls: ['./dash-gauge.component.scss']
})
export class DashGaugeComponent implements OnInit {
  public Constants = {
    width: 138,
    needle_length: 53,
    needle_center_radius: 6
  };

  @Input() public GaugeData: IGaugeData = {
    Min: 0,
    Max: 180,
    Value: 0
  };

  constructor() { }

  ngOnInit(): void {
  }

  public Needlepath() {
    const constants = this.Constants;

    const rotate = (s, angle) => {
      const a = (s.a - angle) * (Math.PI / 180);
      return {
        x: constants.width / 2 + s.r * Math.cos(a),
        y: constants.width / 2 - s.r * Math.sin(a)
      };
    };

    const data = this.GaugeData;
    let rotation = 180 * (data.Value / (data.Max - data.Min));

    rotation = (rotation < 0) ? 0 : ((rotation > 180) ? 180 : rotation);
    const p1 = rotate({ r: constants.needle_length, a: 180 }, rotation);
    const p2 = rotate({ r: constants.needle_center_radius, a: 90 }, rotation);
    const p3 = rotate({ r: constants.needle_center_radius, a: 270 }, rotation);

    return `${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
  }

}
