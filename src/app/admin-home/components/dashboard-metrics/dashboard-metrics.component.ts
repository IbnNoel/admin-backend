import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MetricsService } from '../../services/metrics.service';
import * as moment from 'moment-mini';

@Component({
  selector: 'app-dashboard-metrics',
  templateUrl: './dashboard-metrics.component.html',
  styleUrls: ['./dashboard-metrics.component.css']
})
export class DashboardMetricsComponent implements OnInit {

  searchFormGroup: FormGroup;
  addedList = [
    { display: 'Last 24 hours', value: moment().subtract(1, 'days').format('YYYY-MM-DD[T00:00:00.000Z]') },
    { display: 'Last 3 days', value: moment().subtract(3, 'days').format('YYYY-MM-DD[T00:00:00.000Z]') },
    { display: 'Last 7 days', value: moment().subtract(7, 'days').format('YYYY-MM-DD[T00:00:00.000Z]') },
    { display: 'Last 14 days', value: moment().subtract(14, 'days').format('YYYY-MM-DD[T00:00:00.000Z]') },
    { display: 'Last 30 days', value: moment().subtract(30, 'days').format('YYYY-MM-DD[T00:00:00.000Z]') }
  ];

  metricsData: any;
  dateLabel: string;
  constructor(private formBuilder: FormBuilder, private metricsService: MetricsService) { }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      name: [''],
      date: ['']
    });
    this.onSearchChange();
  }

  onSearchChange() {
    const selectedDate = this.searchFormGroup.getRawValue().date;
    this.dateLabel = this.addedList.find(date => date.value == selectedDate)?.display || 'All time';
    this.metricsService.getDashMetrics(this.searchFormGroup.getRawValue()).subscribe(data => {this.metricsData = data});
  }

}