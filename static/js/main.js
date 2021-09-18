(() => {
  const app = {
    initialize () {
      this.cacheElements();
      this.buildUI();
      this.eventListerners();
      this.fetchWeatherApi();
      this.fetchCovidApi();
      this.fetchUserApi();
      this.fetchGithubSearchUserApi();
      this.fetchGithubRepoApi();
      this.fetchGithubFollowApi();
      this.clockAsString();
      this.hello();
    },

    cacheElements () {
      this.$weather = document.querySelector('.weather');
      this.$covid = document.querySelector('.covid');
      this.$user = document.querySelector('.user');
      this.$git = document.querySelector('.git');
      this.$searchFieldElm = document.getElementById('search-field');
      this.$searchFieldBtn = document.querySelector('.searchfield__button');
      this.$userRepo = document.querySelector('.container__repo');
      this.$userFollow = document.querySelector('.container__follow');
      this.$userContentContainer = document.getElementById('user__content-container');
      this.$checkbox = document.getElementById('checkbox');
      this.$flexContainerMain = document.querySelector('.flex-container__main');
      this.$flexcontainerInfo = document.querySelector('.flex-container__info');
      this.$clock = document.querySelector('.clock');
    },

    buildUI () {
      setInterval(() => { this.digitalClock(); }, 1000);
    },

    eventListerners () {
      this.$searchFieldBtn.addEventListener('click', (event) => {
        this.fetchGithubSearchUserApi();
      });
      this.$checkbox.addEventListener('click', (event) => {
        this.$flexContainerMain.classList.toggle('theme-swither');
        this.$flexcontainerInfo.classList.toggle('theme-swither');
        document.body.classList.toggle('theme-switcher');
      });
    },

    async fetchWeatherApi () {
      const city = 'ghent';
      const weatherApi = new WeatherApi();
      const weather = await weatherApi.getWeatherApi(city);
      this.updateWeatherUi(weather);
    },
    updateWeatherUi (weather) {
      console.log(weather);
      let tempStr = '';
      tempStr += `
      <p>${weather.current.temp_c}°C</p>
      <img src="${weather.current.condition.icon}">
      `;
      this.$weather.innerHTML = tempStr;
    },

    async fetchCovidApi () {
      const covidApi = new CovidApi();
      const covid = await covidApi.getcovidApi();
      this.updateCovidCasesUi(covid);
    },
    updateCovidCasesUi (covid) {
      console.log(covid);
      let myStr = '';

      myStr += covid.records.map(item => `
      <p>${item.fields.cases}</p>
      <img src="static/media/images/covid-19.png" alt="">
      `).join('');
      this.$covid.innerHTML = myStr;
    },

    async fetchUserApi () {
      const userApi = new UserApi();
      const user = await userApi.getuserApi();
      this.userData = user;
      this.updateUserUi();
    },
    updateUserUi () {
      console.log(this.userData);
      let myStr = '';

      myStr += this.userData.person.map(data => `
      <li class="user--list">
          <button class="flex-container__user">
            <img class="user-pic" src="${data.thumbnail}">
            <div>
              <p class="username__github">${data.portfolio.GitHub_gebruikersnaam}</p>
              <p class="voornaam">${data.voornaam}</p>
            </div>
          </button>
      </li>`).join('');
      this.$user.innerHTML = myStr;

      const $userList = document.querySelectorAll('.user--list');
      let $users;
      for (let i = 0; i < $userList.length; i++) {
        $users = $userList[i];
        $users.addEventListener('click', (event) => {
          const username = $userList[i].querySelector('.username__github').innerHTML;
          console.log(username);
          this.updateHTMLForUserDetails(username);
          this.fetchGithubRepoApi(username);
          this.fetchGithubFollowApi(username);
        });
      }
    },

    async fetchGithubSearchUserApi () {
      const searchUserApi = new SearchUserApi();
      const name = await searchUserApi.getGithubSearchUserApi();
      this.githubUserData = name;
      this.updateSearchGithubUserUi();
      this.updateHTMLForGithubUserDetails();
    },

    updateSearchGithubUserUi () {
      console.log(this.githubUserData);
      let myStr = '';

      myStr += this.githubUserData.items.map(userGithubdata => ` 
      <li class="flex-container__search--user user--list">
          <button>
            <img class="github-user__thumbnail" src="${userGithubdata.avatar_url}">
            <p class="username__login">${userGithubdata.login}</p>
          </button>
      </li>
      `).join('');
      this.$git.innerHTML = myStr;

      const $userList = document.querySelectorAll('.user--list');
      let $users;
      for (let i = 0; i < $userList.length; i++) {
        $users = $userList[i];
        $users.addEventListener('click', (event) => {
          const username = $userList[i].querySelector('.username__login').innerHTML;
          console.log(username);
          this.updateHTMLForGithubUserDetails(username);
          this.fetchGithubRepoApi(username);
          this.fetchGithubFollowApi(username);
        });
      }
    },

    async fetchGithubRepoApi (username) {
      const repoUserApi = new RepoUserApi(username);
      const repositories = await repoUserApi.getRepoUserApi();
      this.updateGithubRepoUi(repositories);
    },

    updateGithubRepoUi (repositories) {
      console.log(repositories);
      let tempStr = '';
      const language = 'Language: ';
      const dateStettings = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', minute: 'numeric'
      };
      tempStr += repositories.map(repo => `
      <ul>
        <li class="repo-title">${repo.name}</li>
        <li>${repo.language == null ? '' : language + repo.language}</li>
        <li>Updated on ${new Date(repo.updated_at).toLocaleDateString('nl-BE', dateStettings)}
      </ul>
      `).join('');
      this.$userRepo.innerHTML = tempStr;
    },

    async fetchGithubFollowApi (username) {
      const followUserApi = new FollowUserApi(username);
      const followers = await followUserApi.getFollowUserApi();
      this.updateGithubFollowUi(followers);
    },

    updateGithubFollowUi (followers) {
      console.log(followers);
      let tempStr = '';
      tempStr += followers.map(flw => `
      <div>
        <img src="${flw.avatar_url}">
        <p>${flw.login}</p>
      </div>      
      `).join('');
      this.$userFollow.innerHTML = tempStr;
    },

    updateHTMLForUserDetails (username) {
      console.log(username);
      let tempStr = '';

      console.log(this.userData);
      this.userData.person.map((user) => {
        if (user.portfolio.GitHub_gebruikersnaam === username) {
          tempStr += `
            <img src="${user.thumbnail}">
            <div class="user__content">
                <h1>${user.portfolio.LinkedIn_gebruikersnaam}</h1>
                <span>${user.student === true ? 'Student' : 'Lecturer'}</span>
                <span class="dob">Date of Birth: ${new Date(user.geboortedatum).toLocaleDateString('nl-BE')}</span>
                <p>${user.lijfspreuk}</p>
            </div>
          `;
        }
      });

      this.$userContentContainer.innerHTML = tempStr;
    },

    updateHTMLForGithubUserDetails (username) {
      console.log(username);

      console.log('hello');
      let tempStr = '';
      this.githubUserData.items.map((gitUsr) => {
        if (gitUsr.login === username) {
          tempStr += `
            <img src="${gitUsr.avatar_url}">
            <div class="user__content">
                <h1>${gitUsr.login}</h1>
                <span>${gitUsr.type}</span>
            </div>
          `;
        }
      });

      this.$userContentContainer.innerHTML = tempStr;
    },

    digitalClock () {
      const clock = new Clock().clockAsString(1, 'Ghent');
      this.$clock.innerHTML = clock;
    },

    hello () {
      console.log('hello')
    }

  };
  app.initialize();
})();
