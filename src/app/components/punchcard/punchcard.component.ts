import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Symptom } from '../../../models/symptom';
import { Occurrence } from '../../../models/occurrence';
import { isNullOrUndefined } from 'util';
import moment from 'moment';
import * as d3 from 'd3';

@Component({
  selector: 'punchcard',
  templateUrl: './punchcard.html',
})
export class PunchcardComponent implements AfterViewInit, OnChanges {
  @Input() public symptoms: Symptom[];

  private chart: any;
  private border: any;
  private labelsHours: string[] = [];
  private labelsDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private width: number = window.innerWidth / 2;
  private height: number = window.innerHeight;
  private margin = {top: 10, right: 10, bottom: 10, left: 15};
  private padding: number = 3;
  private xLabelHeight: number = 30;
  private yLabelWidth: number = 80;
  private borderWidth: number = 2;
  private duration: number = 500;

  constructor() {
    this.populateLabelsHours();
  }

  public ngAfterViewInit() {
    this.chart = d3.select('#punchcard').append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', '100%')
      .style('min-height', '300')
      .append('g');

    this.border = this.chart.append('rect')
      .attr('x', this.yLabelWidth)
      .attr('y', this.xLabelHeight)
      .style('fill-opacity', 0)
      .style('stroke', '#000')
      .style('stroke-width', this.borderWidth)
      .style('shape-rendering', 'crispEdges');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    let newSymptoms: Symptom[] = changes['symptoms'].currentValue;
    if (!isNullOrUndefined(newSymptoms) && !isNullOrUndefined(this.chart) && !isNullOrUndefined(this.border)) {
      let daysRow: Array<{ label: string; values: number[] }> = [];
      this.labelsDays.forEach((day: string) => {
        daysRow.push({label: day, values: new Array(24).fill(0)});
      });

      newSymptoms.forEach((symptom: Symptom) => {
        symptom.occurrences.forEach((occurrence: Occurrence) => {
          let momentDate = moment(occurrence.date);
          daysRow[momentDate.day()].values[momentDate.hour()] += 1;
        });
      });
      this.updateGraph(daysRow);
    }
  }

  private updateGraph(data) {
    let labelsX = this.labelsHours;

    let allValues = Array.prototype.concat.apply([], data.map((d) => {
      return d.values;
    }));

    let maxWidth = d3.max(data.map((d) => {
      return d.values.length;
    }));
    let maxR = d3.min([(this.width - this.yLabelWidth) / maxWidth,
        (this.height - this.xLabelHeight) / data.length]) / 2;

    let r = (d) => {
      if (d === 0) {
        return 0;
      }

      let f = d3.scale.sqrt()
        .domain([d3.min(allValues), d3.max(allValues)])
        .rangeRound([2, maxR - this.padding]);

      return f(d);
    };

    let c = d3.scale.linear()
      .domain([d3.min(allValues), d3.max(allValues)])
      .rangeRound([255 * 0.8, 0]);

    let rows = this.chart.selectAll('.row')
      .data(data, (d) => {
        return d.label;
      });

    rows.enter().append('g')
      .attr('class', 'row');

    rows.exit()
      .transition()
      .duration(this.duration)
      .style('fill-opacity', 0)
      .remove();

    rows.transition()
      .duration(this.duration)
      .attr('transform', (d, i) => {
        return 'translate(' + this.yLabelWidth + ',' + (maxR * i * 2 + maxR + this.xLabelHeight) + ')';
      });

    let dots = rows.selectAll('circle')
      .data((d) => {
        return d.values;
      });

    dots.enter().append('circle')
      .attr('cy', 0)
      .attr('r', 0)
      .style('fill', '#ffffff')
      .text((d) => {
        return d;
      });

    dots.exit()
      .transition()
      .duration(this.duration)
      .attr('r', 0)
      .remove();

    dots.transition()
      .duration(this.duration)
      .attr('r', (d) => {
        return r(d);
      })
      .attr('cx', (d, i) => {
        return i * maxR * 2 + maxR;
      })
      .style('fill', (d) => {
        return 'rgb(' + c(d) + ',' + c(d) + ',' + c(d) + ')';
      });

    let dotLabels = rows.selectAll('.dot-label')
      .data((d) => {
        return d.values;
      });

    let dotLabelEnter = dotLabels.enter().append('g')
      .attr('class', 'dot-label')
      .on('mouseover', () => {
        let selection = d3.select(d3.event.currentTarget);
        selection.select('rect').transition().duration(100).style('opacity', 1);
        selection.select('text').transition().duration(100).style('opacity', 1);
      })
      .on('mouseout', () => {
        let selection = d3.select(d3.event.currentTarget);
        selection.select('rect').transition().style('opacity', 0);
        selection.select('text').transition().style('opacity', 0);
      });

    dotLabelEnter.append('rect')
      .style('fill', '#000000')
      .style('opacity', 0);

    dotLabelEnter.append('text')
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('opacity', 0);

    dotLabels.exit().remove();

    dotLabels
      .attr('transform', (d, i) => {
        return 'translate(' + (i * maxR * 2) + ',' + (-maxR) + ')';
      })
      .select('text')
      .text((d) => {
        return d;
      })
      .attr('y', maxR + 4)
      .attr('x', maxR);

    dotLabels
      .select('rect')
      .attr('width', maxR * 2)
      .attr('height', maxR * 2);

    let xLabels = this.chart.selectAll('.xLabel')
      .data(labelsX);

    xLabels.enter().append('text')
      .attr('y', this.xLabelHeight)
      .attr('transform', 'translate(0,-6)')
      .attr('class', 'xLabel')
      .style('text-anchor', 'middle')
      .style('fill-opacity', 0);

    xLabels.exit()
      .transition()
      .duration(this.duration)
      .style('fill-opacity', 0)
      .remove();

    xLabels.transition()
      .text((d) => {
        return d;
      })
      .duration(this.duration)
      .attr('x', (d, i) => {
        return maxR * i * 2 + maxR + this.yLabelWidth;
      })
      .style('fill-opacity', 1);

    let yLabels = this.chart.selectAll('.yLabel')
      .data(data, (d) => {
        return d.label;
      });

    yLabels.enter().append('text')
      .text((d) => {
        return d.label;
      })
      .attr('x', this.yLabelWidth)
      .attr('class', 'yLabel')
      .style('text-anchor', 'end')
      .style('fill-opacity', 0);

    yLabels.exit()
      .transition()
      .duration(this.duration)
      .style('fill-opacity', 0)
      .remove();

    yLabels.transition()
      .duration(this.duration)
      .attr('y', (d, i) => {
        return maxR * i * 2 + maxR + this.xLabelHeight;
      })
      .attr('transform', 'translate(-6,' + maxR / 2.5 + ')')
      .style('fill-opacity', 1);

    let vert = this.chart.selectAll('.vert')
      .data(labelsX);

    vert.enter().append('line')
      .attr('class', 'vert')
      .attr('y1', this.xLabelHeight + this.borderWidth / 2)
      .attr('stroke', '#888')
      .attr('stroke-width', 1)
      .style('shape-rendering', 'crispEdges')
      .style('stroke-opacity', 0);

    vert.exit()
      .transition()
      .duration(this.duration)
      .style('stroke-opacity', 0)
      .remove();

    vert.transition()
      .duration(this.duration)
      .attr('x1', (d, i) => {
        return maxR * i * 2 + this.yLabelWidth;
      })
      .attr('x2', (d, i) => {
        return maxR * i * 2 + this.yLabelWidth;
      })
      .attr('y2', maxR * 2 * data.length + this.xLabelHeight - this.borderWidth / 2)
      .style('stroke-opacity', (d, i) => {
        return i ? 1 : 0;
      });

    let horiz = this.chart.selectAll('.horiz').data(data, (d) => {
      return d.label;
    });

    horiz.enter().append('line')
      .attr('class', 'horiz')
      .attr('x1', this.yLabelWidth + this.borderWidth / 2)
      .attr('stroke', '#888')
      .attr('stroke-width', 1)
      .style('shape-rendering', 'crispEdges')
      .style('stroke-opacity', 0);

    horiz.exit()
      .transition()
      .duration(this.duration)
      .style('stroke-opacity', 0)
      .remove();

    horiz.transition()
      .duration(this.duration)
      .attr('x2', maxR * 2 * labelsX.length + this.yLabelWidth - this.borderWidth / 2)
      .attr('y1', (d, i) => {
        return i * maxR * 2 + this.xLabelHeight;
      })
      .attr('y2', (d, i) => {
        return i * maxR * 2 + this.xLabelHeight;
      })
      .style('stroke-opacity', (d, i) => {
        return i ? 1 : 0;
      });

    this.border.transition()
      .duration(this.duration)
      .attr('width', maxR * 2 * labelsX.length)
      .attr('height', maxR * 2 * data.length);

  }

  private populateLabelsHours() {
    for (let i = 0; i < 24; i++) {
      this.labelsHours[i] = i.toString(10);
    }
  }
}
