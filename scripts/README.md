## INSTALL

* $ curl -L https://cpanmin.us | perl - App::cpanminus
* $ cpanm Carton
* $ cd scripts
* $ carton install

## FAQ

### compile.pl usage (require `cd scripts`)

 * build HTMLs by `carton exec perl compile.pl`
 * re-build all HTML by `carton exec perl compile.pl -f`
 * build specified url by `carton exec perl compile.pl -p why-us`

### Local test

After HTML build, you can run `sudo grunt connect` then visits [https://localhost/en/home.html] for test

### github.io deploy

* `carton exec perl compile.pl -d`


## Compile Parameters

* `-f` force to overwrite the existing HTMLs
* `-d` compile for use in gh-pages of a binary-static fork
* `-p pathname` only compile the files having *pathname* in path
* `-b branchname` to compile the changes to sub-folder named br_branchname
* `-vr` to display list of all generated files
