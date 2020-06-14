const express = require('express');
const app = express();
const morgan = require('morgan')
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

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

function run(jobId, input, output) {

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

    run(jobId, input, output);
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