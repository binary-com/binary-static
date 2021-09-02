# Binary-Static

This repository contains the static HTML, Javascript, CSS, and images content of the [Binary.com](http://www.binary.com) website.

![build](https://img.shields.io/circleci/build/github/binary-com/binary-static) ![node](https://img.shields.io/badge/node-%3E%3D12.22.3-blue.svg) ![npm](https://img.shields.io/badge/npm-%3E%3D6.14.13-blue.svg) ![sass](https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white)

**In this document**

- [Other Documents](#other-documents)
- [Pre-installation](#pre-installation)
- [Preview on your local machine](#preview-on-your-local-machine)
- [Test link deployment](#test-link-deployment)
- [Manage releases](#manage-releases)

## Other Documents

- [Scripts](scripts/README.md)
- [Javascript](src/javascript/README.md)
- [Sass](src/sass/README.md)
- [Templates](src/templates/README.md)

## Pre-installation

Before running or contribute to this project, you need to have the setup of the following packages in your environment

- Ruby, RubyGems
- Sass (`sudo gem install sass`)
- Node.js (12.22.3 is recommended)
- NPM (see <https://nodejs.org/en/download/package-manager/>)
- Grunt (`sudo npm install -g grunt-cli`)

## Quickstart

1.  **Fork the project**

    In order to work on your own version of the Binary.com application, please fork the project to your own repo.

2.  **Clone using SSH**

    ```sh
    git clone git@github.com:your-github-username/binary-com.git
    ```

3.  **Enter project directory**

    ```sh
    cd binary-com
    ```

4.  **Install your dependencies:**

    ```sh
    npm ci
    ```

5.  **To start developing:**

    ```sh
    npm run start
    ```

6.  **Open the source code and start editing!**

    Your site is now running at [https://localhost:443](https://localhost:443)

## Preview on your local machine

- To preview your changes locally, run `sudo grunt serve`
- It will watch for Javascript or CSS changes and will rebuild on every change you make.
- To test changes made to templates, you need to re-compile them:
  - `grunt shell:compile_dev` to re-compile all templates.
  - `grunt shell:compile_dev --path=about-us` to re-compile only template(s) which serve about-us path in URL.
- To fix eslint errors run `npm run eslint`

## Test link deployment

There are two types of test link deployment preview:

1. Automatic deployment

Upon creating PR, `Vercel` (https://vercel.com/) will auto-generate the test link inside the PR. you can use that to preview the test link for the changes you have made.

2. Manual deployments

You can manually deploy your test link using gh-pages with the following configurations:

### Deploy to your gh-pages for the first time

1.  Register your application [here](https://developers.binary.com/applications/). This will give you the ability to redirect back to your Github pages after login.
    Use `https://YOUR_GITHUB_USERNAME.github.io/binary-static/en/logged_inws.html` for the Redirect URL and `https://YOUR_GITHUB_USERNAME.github.io/binary-static/en/redirect.html` for the Verification URL.

        If you're using a custom domain, replace the Github URLs above with your domain.

2.  In `src/javascript/config.js`: Insert the `Application ID` of your registered application in `user_app_id`.

- **NOTE:** In order to avoid accidentally committing personal changes to this file, use `git update-index --assume-unchanged src/javascript/config.js`

3. Run `grunt dev`

### Deploy js/css and template changes together

```sh
grunt dev
```

### Deploy only js/css changes

```sh
grunt deploy
```

### Deploy some template changes

```sh
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

### Use a custom domain

In order to use your custom domain, please put it in a file named `CNAME` inside `scripts` folder of your local clone of binary-static.

## Manage releases

```sh
git tag ${RELEASE_TARGET}_vYYYYMMDD_${INTEGER} -m 'some message'
```

> `RELEASE_TARGET` could be one of **staging** or **production** for staging and production release respectively.

Example:

```sh
git tag production_v20191010_0 -m 'release fixes to production'
```

Push the tag:

```sh
git push origin staging_v20191010_0
```

## Manage translations

- Automatic: this will be done automatically with [Github action](.github/workflows/sync_crowdin_translations.md)
- Manual: If you need to add translation manually use [manual translation doc](scripts/README.md#Updating-the-translations)
