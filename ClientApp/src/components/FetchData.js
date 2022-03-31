import React, { Component } from 'react';

let getCookie = cname => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true , logged : false};
    }

    componentDidMount() {
        this.populateWeatherData();
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
            ? <p><em>No access...</em></p>
            : FetchData.renderForecastsTable(this.state.forecasts);

        let login = this.state.logged
            ? ""
            : <button onClick={() => this.login()} >Login!</button>;


        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {login}
                {contents}
            </div>
        );
    }

    async login() {
        fetch('cookie/login', {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "login": "juzek",
                "password": "maslo"
            })

        })
            .then(res => {
                if (res.status >= 400) {
                    throw new Error("Server responds with error!");
                }
                return res.json();
            })
            .then(forecasts => {
                console.log("Login Ok");
                this.populateWeatherData();
                this.setState({
                    logged: true
                })
            },
                err => {
                    console.log("Login Error")
                    this.setState({
                        logged: false,
                    })
                });

        

    }


    async populateWeatherData() {
        fetch('WeatherForecast/PostWeather', {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': getCookie("X-CSRF-FORM-TOKEN")
            })
        })
            .then(res => {
                if (res.status >= 400) {
                    throw new Error("Server responds with error!");
                }
                return res.json();
            })
            .then(forecasts => {
                console.log("Ok")
                this.setState({
                    forecasts,
                    loading: false
                })
            },
                err => {
                    this.setState({
                        loading: true
                    })
                });
    }
}
