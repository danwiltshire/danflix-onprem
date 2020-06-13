const express = require('express');
const app = express();
var morgan = require('morgan')
var ffmpeg = require('fluent-ffmpeg');

/**
 * Use apache 'combined' format logging
 */
app.use(morgan('combined'))

function run(jobId, inputPath, outputPath) {

  console.log("Running transcode job ID " + jobId)

  return new Promise(async (resolve, reject) => {
    return ffmpeg()
      .input(inputPath)
      .noAudio()
      .output(outputPath)
      .on('progress', function(progress) { jobs.set( jobId, Math.ceil(progress.percent) ) })
        // todo.. delete dict entry when job errors/completes
      .on('end', resolve)
      .on('error', reject)
      .run();
  })

}

// Returns a random integer
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Temporary jobId and progress info
let jobs = new Map();

// Post a transcode job for specified :mediaId
app.post('/job/run', function(req, res) {

  const jobId = getRandomInt(1024);
  run(jobId, "test/video/sample_video/4K.mp4", "test/video/output_video/1.mp4");
  res.end(JSON.stringify({ jobId: jobId }));

});

// Get status of a transcode job
app.get('/job/progress', function(req, res) {

  if ( jobs.has(parseInt(req.query.jobId)) ) {
    res.end(JSON.stringify({ progress: jobs.get(parseInt(req.query.jobId)) })); // Return progress as JSON
  } else {
    res.status(404).end();
  }
  
});

app.listen(8080, function() {
  console.log('Transcode app listening on port 8080!');
});