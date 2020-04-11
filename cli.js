#!/usr/bin/env node
const axios = require('axios'),
      clear = require('clear'),
      ora = require('ora'),
      spinner = ora({ text: 'Loading...'}),
      covid19 = require('./lib/cli'),
      covid19GFX = require ('./lib/cli/gfx'),
      http = require('http'),
      apiBaseURL = "https://corona.lmao.ninja",
      argv = require('yargs')
            .usage('Usage: $0 <country> [options]')
            .example('$0 PH', 'Generate stats for Philippines. ISO 3166-1 is supported')
            .nargs('plain', 0)
            .describe('plain', 'If your cli does not support ANSI encoding similar to /cmd usage and layout')        
            .example('$0 PH --plain', 'Generate stats for Philippines with plain format')
            .help('help')
            .argv;   

const getGlobal = (data) => {
    const params = [ data.cases, data.deaths,data.recovered, data.updated];
    let result;
    
    if(argv.plain) {
        result = covid19.plainglobaltracker(...params);
        spinner.stop();
        return console.log(result);
    }

    result = covid19.covid19globaltracker(...params);
    spinner.stop();
    return console.log(result);
}

const getCountry = async (u, country) => {
    let result;
    const api = await axios.get(`${apiBaseURL}/countries/${country}`),
            d = api.data;
    
    const params = [
        d.country, d.cases, d.todayCases, d.deaths, d.todayDeaths, 
        d.recovered, d.active, d.critical, d.casesPerOneMillion,
        u.updated
    ];

    if(argv.plain) {
        result = covid19.plaincountrytracker(...params);
        spinner.stop();
        return console.log(result);
    }
    result = covid19.covid19countrytracker(...params);
    spinner.stop();
    return console.log(result);
}


const getCountryGFX = async (u, country) => {
    let result;
    let resHead = {}
    const api = await axios.get(`${apiBaseURL}/countries/${country}`),
            history = await axios.get(`${apiBaseURL}/v2/historical/${api.data.country}?lastdays=all`),
            s = api.data,
            h = history.data,
            chartType = 'cases';


    var http = require('http');
        http.createServer(function (req, res) {
            resHead = res
        return covid19GFX.historyCountryTracker(
            req,res,
            s.country, s.cases, s.todayCases, 
            s.deaths, s.todayDeaths, s.recovered, 
            s.active, s.critical, s.casesPerOneMillion,
            s.updated, h, chartType, s.countryInfo)
    }).listen(1000);

    result = await axios.get('http://localhost:1000')
    clear()
    spinner.stop();
    console.log(result.data)
    return 'dfdfd'
    
    

  
}

       
(async () => {
    clear();
    spinner.start();
    country = argv._[0];      
    const all = await axios.get(`${apiBaseURL}/all`);
    getCountryGFX(all.data, country);
      
})()
