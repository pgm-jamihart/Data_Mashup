function WeatherApi () {
  this.getWeatherApi = async (city) => {
    this.WEATHER_API = `https://api.weatherapi.com/v1/current.json?key=a1116149e39340d8af3121346202112&q=${city}`;
    try {
      const response = await fetch(this.WEATHER_API);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  };
}

function CovidApi () {
  this.getcovidApi = async () => {
    this.COVID_CASES = 'https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=';
    try {
      const response = await fetch(this.COVID_CASES);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  };
}

function UserApi () {
  this.getuserApi = async () => {
    this.PERSON_JSON = './static/data/pgm.json';
    try {
      const response = await fetch(this.PERSON_JSON);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  };
}

function SearchUserApi () {
  this.getGithubSearchUserApi = async () => {
    this.PERSON_GITHUB_SEARCH_FIELD = 'https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=';
    $searchFieldElm = document.getElementById('search-field');
    try {
      const response = await fetch(this.PERSON_GITHUB_SEARCH_FIELD + $searchFieldElm.value);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  };
}

function RepoUserApi (username) {
  this.getRepoUserApi = async () => {
    this.PERSON_GITHUB_REPO = `https://api.github.com/users/${username === undefined ? 'pgm-jamihart' : username}/repos?page=1&per_page=50`;
    try {
      const response = await fetch(this.PERSON_GITHUB_REPO);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  };
}

function FollowUserApi (username) {
  this.getFollowUserApi = async () => {
    this.PERSON_GITHUB_FOLLOW = `https://api.github.com/users/${username === undefined ? 'pgm-jamihart' : username}/followers?page=1&per_page=100`;
    try {
      const response = await fetch(this.PERSON_GITHUB_FOLLOW);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  };
}

function Clock () {
  this.clockDigits = function (nmbr, amnt) {
    let str = String(nmbr);
    while (str.length < amnt) {
      str = `0${str}`;
    }
    return str;
  };
  this.clockAsString = function (utc, city) {
    const date = new Date();
    date.setHours(date.getHours() + utc + date.getTimezoneOffset() / 60);
    return `<span>${this.clockDigits(date.getHours(), 2)}:${this.clockDigits(date.getMinutes(), 2)}:${this.clockDigits(date.getSeconds(), 2)}</span> 
    <span class="clock__city">${city}</span>`;
  };
}
