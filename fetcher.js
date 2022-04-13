const request = require('request');
const fs = require('fs');
const args = process.argv.splice(2);
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const validateURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
};

const fetchAndSave = (URL, localPath) => {
  if (args.length < 2 || !validateURL(URL)) {
    console.log(`File path invalid or missing or Invalid URL`);
    process.exit();
  } else {
    request(URL, (error, statusbar, body) => {
      if (error) {
        console.log(`failed to dowload`);
        return;
      }
      if (fs.existsSync(localPath)) {
        rl.question(`File ${localPath} already exists. Do you want to overwrite it? (Y/n)\n`, (answer) => {
          if (answer === 'Y' || answer === 'y') {
            fs.writeFile(localPath, body, (err) => {
              if (err) {
                console.log(`failed to download`);
                return;
              } else {
                console.log(`Downloaded and saved ${body.length} bytes to ${localPath}`);
                process.exit();
              }
            });
          } else if (answer === 'N' || answer === 'n') {
            process.exit();
          }
          rl.close();
        });
      } else {
        fs.writeFile(localPath, body, (err) => {
          if (err) {
            console.log(`failed to download`);
            return;
          } else {
            console.log(`Downloaded and saved ${body.length} bytes to ${localPath}`);
            process.exit();
          }
        });
      }
    });
  }
};

fetchAndSave(args[0], args[1]);