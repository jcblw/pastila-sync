# Pastila Sync

[![Greenkeeper badge](https://badges.greenkeeper.io/jcblw/pastila-sync.svg)](https://greenkeeper.io/)

This is a small menubar app that acts like dropbox sync but with gist files. Its still in early dev and would love feedback on it.

![screenshot gist](https://github.com/jcblw/pastila-sync/blob/master/assets/screenshot-gists.png?raw=true)

### Setup

> Note: this will be a packaged app soon but right now you will have to install it manually

```shell
git clone https://github.com/jcblw/pastila-sync.git
cd pastila-sync
npm install
npm run build
```

This gets you 90% setup. Now you can start the application.

```shell
npm start
```

> Note: some empty states are not yet handled :D. PRs are welcomed

Great! now you should see a little  ![icon](https://github.com/jcblw/pastila-sync/blob/master/assets/active.png?raw=true) in your toolbar. Click on that to configure the application.

### Application Config

There is a few things you will need to config to get **pastila-sync** working on your computer.

![screenshot settings](https://github.com/jcblw/pastila-sync/blob/master/assets/screenshot-settings.png?raw=true)

#### Personal Access Token

You can get a Github [personal access token here](https://github.com/settings/tokens).

> Personal access tokens function like ordinary OAuth access tokens. They can be used instead of a password for Git over HTTPS, or can be used to authenticate to the API over Basic Authentication.

It will need one permission

- gists

Then paste that key into the field in the settings.

##### Directory to sync

This should be a directory in you home directory. Something like `/Users/foo/gist-sync` will work. To see your user on Mac you can use `whoami` in the terminal.

> Future iterations will create a directory for you on initial install.

##### Click Update

Once you fill out those pieces of info click update and it should update your users and pull down you recent gists.

### Contributing

You will need to run build before each restart, and right now thing don't hot reload :(

```shell
npm run build # or watch to watch files
```

Plz do, I look forward to them :D. Also run `npm test` to run the linter.
