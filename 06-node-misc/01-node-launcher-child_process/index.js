// nodejs runs .bat-file (in Windows)
const { exec } = require("child_process");
exec("C:\\my.bat", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
