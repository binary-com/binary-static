Binary-Static
=============

This repository contains the static HTML, Javascript, CSS, and images content of the [Binary.com](http://www.binary.com) website.

## Installation

In order to work on your own version of the Binary.com Javascript and CSS, please **fork this project**.

You will also need to install the following on your development machine:

- Ruby, RubyGems
- Sass (`sudo gem install sass`)
- Node.js and NPM (see <https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager>)

- Go to project root

```bash
npm install
sudo npm install -g grunt-cli

curl -L https://cpanmin.us | sudo perl - App::cpanminus
sudo cpanm Carton
cd scripts
sudo carton install
```

#### Note: 
You need to have the latest `node` & `npm` versions 

Make sure to use `Perl 5.18.2`

In Mac systems, the safest way to install an old version of Perl is: 

```
curl -L https://install.perlbrew.pl | bash
source ~/perl5/perlbrew/etc/bashrc
perlbrew init
perlbrew install 5.18.2
perlbrew switch perl-5.18.2
```


How to work with this project
=============================

### Deploy to your gh-pages for the first time

1. You need to have your own application registered at Binary.com because it should redirect client to your github pages after login. There is no UI for it yet, so you can send the following request for now (change *YOUR_APP_NAME* and *YOUR_GITHUB_USERNAME* as well):

    ```json
    {
      "app_register": 1,
      "name": "YOUR_APP_NAME",
      "scopes": [
        "read",
        "admin",
        "trade",
        "payments"
      ],
      "redirect_uri": "https://YOUR_GITHUB_USERNAME.github.io/binary-static/en/logged_inws.html"
    }
    ```

2. Put the `app_id` returned by WebSocket in `src/javascript/config.js`
  * **NOTE:** In order to avoid accidentally committing personal changes to this file, use `git update-index --assume-unchanged src/javascript/config.js`

3. Run `grunt dev`


### Deploy js/css and template changes together

```
grunt dev
```


### Deploy only js/css changes

```
grunt deploy
```


### Deploy some template changes

```
grunt dev --path=about-us
```


### Using sub-folders
There are times that you're working on various branches at the same time, and you want to deploy/test each branch separately on your gh-pages, you can simply use `--branch=branchname` for grunt commands:
- `grunt dev --branch=branchname`
This will deploy your changes to a sub-folder named: `br_branchname` and it can be browsed at: https://YOUR_GITHUB_USERNAME.github.io/binary-static/br_branchname/

### Preview on your local machine
- To preview your changes locally, run `sudo grunt serve`
- It will watch for js/css changes and rebuild on every change you make.
- To test changes made to templates, you need to re-compile them:
  - `grunt shell:compile_dev` to re-compile all templates.
  - `grunt shell:compile_dev --path=about-us` to re-compile only template(s) which serve about-us path in URL.


## Release to Production

```
grunt release --staging=1|--production=1|--translations=1 [--cleanup]
```
(The value is needed when more than one option is used)

### Parameters:
- `--staging` or `--production` or `--translations` (mandatory)
  - In order to prevent accidentally releasing to the wrong target, it is mandatory to provide one of these parameters.
  - Your remote origin will be checked to be the correct target of the given parameter.
  - Your current branch will be checked to be the correct branch of the given parameter.
- `--cleanup` [optional]
  - Create CNAME file with proper value according to remote origin
  - Deploy to gh-pages with the option `add: false`
