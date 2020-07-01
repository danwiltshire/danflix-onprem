const crypto = require('crypto');

/**
 * Returns the MD5 hash of a file
 * @param {*} path - Path to the file
 */
function getChecksums(dir, files) {

    console.log("Running getChecksums()")
  
    const hash = crypto.createHash('md5');
  
    files.forEach((file) => {
      console.log("Checksumming " + dir + file)
  
      const input = fs.createReadStream(dir + file);
      input.on('readable', () => {
        // Only one element is going to be produced by the
        // hash stream.
        const data = input.read()
        if (data)
          hash.update(data)
      })
    })
  
    return hash.digest('hex')
  
  }