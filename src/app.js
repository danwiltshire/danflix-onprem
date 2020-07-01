const express = require('express');
const app = express();
const morgan = require('morgan')
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Body parsing for handling HTTP POST data
app.use(express.urlencoded({ extended: true }));

// Use apache 'combined' format logging
app.use(morgan('combined'));


// The jobId and job progress
let jobs = new Map();

// Media index - will be replaced by database
let media = new Map();
media.set(1, { "path": "test/video/sample_video/1080p/1.mp4", title: "Sample Text" });

/**
 * Returns file paths in a directory as an array
 * @param {*} dir - The relative or absolute path to the directory
 */
function getFiles(dir) {
  console.log("Running getFiles()")
  return new Promise((resolve, reject) =>
    fs.readdir(dir, (err, files) => err ? reject(err) : resolve(files))
  )
}

/**
 * When a job is started, progress will be reported as a number out of 100.
 * The function will round up for less data storage and less processing required on the front-end
 * @param {Number} max - Random number will not be higher than this value
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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

  return new Promise((resolve, reject) => {
    setTimeout( function() {
      resolve("Success!")  // Yay! Everything went well!
    }, 2000)
    /* ffmpeg()
      .input(input)
      .outputOptions(['-f hls', '-start_number 0', '-hls_time 10', '-hls_list_size 0'])
      .output(output)
      .on('progress', function(progress) { jobs.set( jobId, Math.ceil(progress.percent) ) })
      .on('end', resolve())
      .on('error', reject())
      .run(); */
  })
}

/**
 * Runs a transcoding job for the specified media
 */
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

    transcode(jobId, input, output)
    .then(() => getFiles(outputDir))
    .then((files) => getChecksums(outputDir + '/', files))
    .then((checksums) => console.log(checksums))
    .then(() => console.log("Job " + jobId + ": Finished."))
    .catch((err) => console.log("Error transcoding" + err))

    res.end( JSON.stringify({ jobId: jobId }) );

  } else {
    res.status(404).end();
  }
});

/**
 * Gets the progress of a transcoding job
 */
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

/**
 * Gets the progress of all transcoding jobs
 */
app.get('/jobs', function(req, res) {
  // Return all jobs as JSON
  res.end( JSON.stringify(Array.from(jobs.entries())) );
});

/**
 * Start the Express HTTP server
 */
app.listen(8080, function() {
  console.log('Transcode app listening on port 8080!');
});