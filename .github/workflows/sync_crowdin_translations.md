# Sync Crowdin translations

This action will automatically extract strings from the binary-static repo and upload them to Crowdin. It will also check whether Crowdin has new translations available, and if so, it will automatically download these translations and create a PR to binary-static's `master` branch to merge them in. If you want to approve and merge the created PR automatically, you need to pass a REVIEWER_ACCESS_TOKEN to the action. It will be used to approve and merge the created branch.
If there are new strings to translate, it will send a slack message to inform the translation team if there is TRANSLATIONS_SLACK_WEBHOOK available.

Required GitHub secrets:

- `PERSONAL_ACCESS_TOKEN`: (GitHub PAT) To allow the action to authenticate with Git for git operations.
- `CROWDIN_API_KEY`: To allow us to download and upload new language files to and from Crowdin.
- `TRANSLATIONS_SLACK_WEBHOOK`: (Optional) To allow send a slack message to inform the translation team in case new strings found.
- `REVIEWER_ACCESS_TOKEN`: (Optional) To approve and merge the translation PR automatically. It is a GitHub PAT and must be different with `PERSONAL_ACCESS_TOKEN`.