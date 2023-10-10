const fs = require('fs');
const fse = require('fs-extra');
const glob = require('glob');

const source_folder = './src/root_files/_common/deriv';
const copied_folder = './src/root_files/_common/copy';

const copy = (callback) => {
    fse.copy(source_folder, copied_folder, callback);
};

const html_files = [];
const all_files = [];

const getDirectories =  (src, callback) =>  {
    glob(`${src  }/**/*`, callback);
};

// text.match(/href="(.*?)"/g)[0]

const updateSourceDirectory = (files) => {
   
    files.forEach(file => {

        fs.readFile(file, 'utf8', (err,data) => {
            if (err) {
                return console.log(err);
            }
            const result = data.replace(/href="/g, 'href="/deriv');

            fs.writeFile(file, result, 'utf8', (err) => {
                if (err) return console.log(err);

                console.log(`handled: ${file}`);
            });
        });
    });
    
};

const init = () => {
    // copy((err) => {
       
    //     if (err) throw err;
    //     console.log('Folder directory created');
      
    // }
    // );

    copy((err) => {
        if (err) {console.log('Error', err);}

        getDirectories(copied_folder, (err, res) => {
            if (err) {
                console.log('Error', err);
            } else {
                res.forEach(file => {
                    all_files.push(file);
                    if (file.includes('.htm')){
                        html_files.push(file);
                    }
                });
            }

            updateSourceDirectory(html_files);
        });
       
    });
};

init();

