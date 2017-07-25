#!/bin/sh

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
WHITE='\033[1;37m'
RESET='\033[0m'

function message {
    echo ${GREEN}"  >"${RESET} $1
}

function confirm {
    read -p "$(echo "\n"${WHITE}$1${YELLOW}) " -n 1 -r &&
    echo "${RESET}"
}

cd $(git rev-parse --show-toplevel) &&

message "Updating translations branch" &&
git checkout translations &&
git fetch upstream translations &&
git reset --hard upstream/translations &&

confirm "Include the master changes as well? (merge master into translations)" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Updating master branch" &&
    git fetch upstream master:master &&
    message "Merging master into translations"
    git merge upstream/master --no-edit
fi &&

cd scripts

confirm "Update the source file (messages.pot) and push to Crowdin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Updating translations source file" &&
    ./translation.sh &&
    message "Uploading source file to Crowdin"
    crowdin upload sources
fi &&

confirm "Download translation files and update javascript texts?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Downloading translation files from Crowdin (*.po)" &&
    crowdin download &&
    message "Updating javascript translation files (*.js)"
    ./js_translation.sh
fi &&

confirm "Commit changes and push to origin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd $(git rev-parse --show-toplevel) &&
    message "Committing"
    git commit -a -m "Update translations" &&
    message "Pushing"
    git push origin translations
fi &&

echo ${GREEN}"\nSuccessfully Done." &&

if [[ $REPLY =~ ^[Yy]$ ]]
then
    confirm "Open github to submit the PR?" &&
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        open "https://github.com/binary-com/binary-static"
    fi
fi
