import React, { Component } from 'react';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true, data: null, empList: null};
  }

  componentDidMount() {
    this.populateWeatherData();
    this.populateSharePointData();
    this.populateEmployeeData();
  }

  static renderForecastsTable(forecasts) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderForecastsTable(this.state.forecasts);
    let { data } = this.state;
    return (
      <div>
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        <div>{contents}</div>
        <p>connnected to sharepoint site : {(data && data.web_title) ? data.web_title : ''} - {(data && data.list_count) ? data.list_count : 0}</p>
      </div>
    );
  }

  async populateWeatherData() {
    const response = await fetch('weatherforecast');
    const data = await response.json();
    //console.log(data);
    this.setState({ forecasts: data, loading: false });
  }

  async populateSharePointData() {
    const response = await fetch('api/document/sharepoint');
    const res = await response.json();
    console.log(res.data.result);
    this.setState({ data: res.data.result });
  }

  async populateEmployeeData() {
    const response = await fetch("https://development365.sharepoint.com/sites/develop/_api/web/lists/GetByTitle('Employees')/items?&$top=10&$expand=AttachmentFiles");
    const res = await response.json();
    console.log(res.data.result);
    this.setState({ empList: res.data.result });
  }
}
