const express = require('express');
const app = express();
const morgan = require('morgan')
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const AWS = require('aws-sdk');
const crypto = require('crypto');












/**
 * Uploads a file to AWS S3
 */
function upload() {
  // Set the region 
  AWS.config.update({region: 'eu-west-2'});

  // Create S3 service object
  s3 = new AWS.S3({apiVersion: '2006-03-01'});

  // call S3 to retrieve upload file to specified bucket
  var uploadParams = {Bucket: 'danflix-onprem' };
  var file = 'test/video/sample_video/4K/1.mp4';

  // Configure the file stream and obtain the upload parameters
  //var fs = require('fs');
  var fileStream = fs.createReadStream(file);
  fileStream.on('error', function(err) {
    console.log('File Error', err);
  });
  uploadParams.Body = fileStream;
  var path = require('path');
  uploadParams.Key = path.basename(file);

  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  }).on('httpUploadProgress', function(progress) {
    console.log(progress);
  });
}


/**
 * Returns file paths in a directory as an array
 * @param {*} dir - The relative or absolute path to the directory
 */
function getFiles(dir) {
  return new Promise((resolve, reject) =>
    fs.readdir(dir, (err, files) => err ? reject(err) : resolve(files))
  )
}













/* console.log('The value of PORT is:', process.env.AWS_ID);

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  }
});

// The name of the bucket that you have created
const BUCKET_NAME = 'danflix-onprem';

const uploadFile = (fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: 'cat.jpg', // File name you want to save as in S3
      Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  }).on('httpUploadProgress', function(progress) {
    console.log(this.body.percent);
    console.log(progress.percent);
  });
};

uploadFile('test/video/sample_video/4K/1.mp4'); */


/* function upload(path) {
  
} */

//upload('test/video/sample_video/4K/1.mp4');



// Body parsing for handling HTTP POST data
app.use(express.urlencoded({ extended: true }));

// Use apache 'combined' format logging
app.use(morgan('combined'));

// Media index - will be replaced by database
let media = new Map();
media.set(1, { "path": "test/video/sample_video/4K/1.mp4", title: "A 4K Cityscape" });

/**
 * When a job is started, progress will be reported as a number out of 100.
 * The function will round up for less data storage and less processing required on the front-end
 * @param {Number} max - Random number will not be higher than this value
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// The jobId and job progress
let jobs = new Map();

/**
 * Runs an FFmpeg transcode job using the fluent-ffmpeg wrapper.
 * Returns a Promise that can be handled appropriately.
 * @param {Number} jobId - The Job ID
 * @param {String} input - The source for FFmpeg
 * @param {String} output - The output for FFmpeg
 */
function transcode(jobId, input, output) {

  console.log("Job " + jobId + ": Starting...");
  console.log("Job " + jobId + ": Input: " + input)
  console.log("Job " + jobId + ": Output: " + output)

  return new Promise(async (resolve, reject) => {
    return ffmpeg()
      .input(input)
      .outputOptions(['-f hls', '-start_number 0', '-hls_time 10', '-hls_list_size 0'])
      .output(output)
      .on('progress', function(progress) { jobs.set( jobId, Math.ceil(progress.percent) ) })
      .on('end', resolve)
      .on('error', reject)
      .run();
  })
}





/**
 * Returns the MD5 hash of a file
 * @param {*} path - Path to the file
 */
function checksumFiles(files) {

  console.log("Running checksumFiles()")

  files.forEach((file) => {
    console.log(file)
  });

/*   const hash = crypto.createHash('md5');

  const input = fs.createReadStream(path);
  input.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = input.read();
    if (data)
      hash.update(data);
    else {
      console.log(`${hash.digest('hex')} ${path}`);
    }
  }); */

}


//md5('test/video/sample_video/4K/1.mp4');


// Spawn a transcode job for the specified :mediaId
app.post('/job/run', function(req, res) {

  // HTTP query parameters are strings by default - cast to int
  const mediaId = parseInt( req.body.mediaId );

  if ( media.has( mediaId ) ) {
    const mediaItem = media.get( mediaId );
    const jobId = getRandomInt(1024);
    const input = mediaItem.path;
    const outputDir = "test/video/output_video/" + mediaId;
    const output = outputDir + "/" + mediaId + ".m3u8";

    // Create output directory for ffmpeg
    if (!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let job = transcode(jobId, input, output);
    job.then(function() {
      console.log("Job " + jobId + ": Finished.");
      getFiles(outputDir)
      .then((files) => console.log(files))
      .catch((error) => console.log(error))
    }, function() {
      console.log("Job " + jobId + ": Failed!");
    });

    transcode(jobId, input, output)
    .then(function() {
      getFiles(outputDir)
    })
    //.then(() => getFiles(outputDir))
    .then((checksumFiles()))
    .catch((error) => console.log(error))


//    .then(console.log("Job " + jobId + ": Finished."))

    res.end( JSON.stringify({ jobId: jobId }) );
  } else {
    res.status(404).end();
  }
});

// Get status of a transcode job for the specified :jobId
app.get('/job/progress', function(req, res) {

  // HTTP query parameters are strings by default - cast to int
  const jobId = parseInt( req.query.jobId );

  // Return the progress in JSON (progress:X)
  if ( jobs.has( jobId ) ) {
    res.end(JSON.stringify({ progress: jobs.get( jobId ) }));
  } else {
    res.status(404).end();
  }
});

// Get status of a transcode job for the specified :jobId
app.get('/jobs', function(req, res) {

  // Return all jobs as JSON
  res.end( JSON.stringify(Array.from(jobs.entries())) );

});

// Start the HTTP server
app.listen(8080, function() {
  console.log('Transcode app listening on port 8080!');
});