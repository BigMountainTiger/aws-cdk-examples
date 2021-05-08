import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-example',
  templateUrl: './d3-example.component.html',
  styleUrls: ['./d3-example.component.css']
})
export class D3ExampleComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    // Here to add d3

    const d2r = function(d) {
      return d * (Math.PI / 180);
    };

    const c = {
      element: '.needle',
      width: 138,
      height: 69,
      r: 6,
      fill: '#12273c'
    };

    const rotate = (s, angle) => {
      const a = s.a - angle;
      console.log(a);
      return {
        x: c.height + s.r * Math.cos(d2r(a)),
        y: c.height - s.r * Math.sin(d2r(a))
      }
    };

    const getPoints = function(rotation) {
      const p1 = rotate({r: 53, a: 180}, rotation);
      const p2 = rotate({r: 6, a: 90}, rotation);
      const p3 = rotate({r: 6, a: 270}, rotation);

      return `${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
    };
      
    const Gauge = function() {
          
      const svg = d3.select(c.element).append('svg')
        .attr('width', c.width).attr('height', (c.height + c.r));

      svg.append('circle').attr('cx', '50%').attr('cy', c.height).attr('r', c.r).style('fill', c.fill);
      svg.append('circle').attr('cx', '50%').attr('cy', c.height).attr('r', 1).style('fill', "#808080");
      // var points = `16 ${c.height}, ${c.height} ${c.height - c.r}, ${c.height} ${c.height + c.r}`;
      var points = getPoints(0);
      svg.append('polyline')
        .attr('points', points)
        .style('fill', c.fill);

    }

    new Gauge();

  }


  // public needle_data;

  public getPoints(rotation) {

    const c = { width: 138, height: 69, r: 6 };

    const rotate = (s, angle) => {
      const a = (s.a - angle) * (Math.PI / 180);
      return {
        x: c.height + s.r * Math.cos(a),
        y: c.height - s.r * Math.sin(a)
      }
    };

    const p1 = rotate({r: 53, a: 180}, rotation);
    const p2 = rotate({r: 6, a: 90}, rotation);
    const p3 = rotate({r: 6, a: 270}, rotation);

    return `${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
  }

  public needle_pointer() {
    return this.getPoints(this.need_data);
  }

  private need_data = 0;
  ngOnInit(): void {
    setInterval(() => {
      let data = this.need_data;
      data += (180 / 30);

      this.need_data = (data > 180)? 0: data;

    }, 1000)
  }

}
