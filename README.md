Binary-Static 
=============

This repository contains the static HTML, Javascript, CSS, and images content of the [Binary.com](http://www.binary.com) website.

## Installation

In order to work on your own version of the Binary.com Javascript and CSS, please **fork this project**.

You will also need to install the following on your development machine:

- Ruby, RubyGems
- Sass (`sudo gem install sass`)
- Node.js (10.14.2 or higher is recommended) and NPM (see <https://nodejs.org/en/download/package-manager/>)
- Go to project root, then run `npm install`
- Grunt (`sudo npm install -g grunt-cli`)

### Use a custom domain
In order to use your custom domain, please put it in a file named `CNAME` inside `scripts` folder of your local clone of binary-static.


How to work with this project
=============================

## Test link deployments

There are two types of test link deployment preview:

1. Automatic deployment

Upon creating PR, `vercel` (https://vercel.com/) will auto-generate test link inside the PR. you can use that to preview test link for the changes you have made.

2. Manual deployments

You can manually deploy your test link using gh-pages with the following configurations:
### Deploy to your gh-pages for the first time

1. Register your application [here](https://developers.binary.com/applications/). This will give you the ability to redirect back to your github pages after login.
Use `https://YOUR_GITHUB_USERNAME.github.io/binary-static/en/logged_inws.html` for the Redirect URL and `https://YOUR_GITHUB_USERNAME.github.io/binary-static/en/redirect.html` for the Verification URL.

    If you're using a custom domain, replace the github URLs above with your domain.

2. In `src/javascript/config.js`: Insert the `Application ID` of your registered application in `user_app_id`.
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
There are times that you are working on various branches at the same time, and you want to deploy/test each branch separately on your gh-pages, you can simply use `--branch=branchname` for grunt commands:
- `grunt dev --branch=branchname`
This will deploy your changes to a sub-folder named: `br_branchname` and it can be browsed at: https://YOUR_GITHUB_USERNAME.github.io/binary-static/br_branchname/

In order to remove the created folders from your gh-pages, you can use either:
- `grunt dev --cleanup`: removes all `br_*` folders and deploys to the root folder.

  or
- `grunt shell:remove_folder --folder=br_branchname1,br_branchname2,...`: only removes the specified folder(s) from your gh-pages.

  or
- `grunt shell:remove_folder --keep --folder=br_branchname1,br_branchname2,...`: only keeps the specified folder(s) on your gh-pages and removes everything else. Just add the `--keep` flag.

## Preview on your local machine
- To preview your changes locally, run `sudo grunt serve`
- It will watch for js/css changes and rebuild on every change you make.
- To test changes made to templates, you need to re-compile them:
  - `grunt shell:compile_dev` to re-compile all templates.
  - `grunt shell:compile_dev --path=about-us` to re-compile only template(s) which serve about-us path in URL.
- To fix eslint errors run `npm run eslint`

## Release

```
git tag ${RELEASE_TARGET}_vYYYYMMDD_${INTEGER} -m 'some message'
```

> `RELEASE_TARGET` could be one of **staging** or **production** for staging and production release respectively.

Example: 

```
git tag production_v20191010_0 -m 'release fixes to production'
```

Push the tag:

```
git push origin staging_v20191010_0
```
