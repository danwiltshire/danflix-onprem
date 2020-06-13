const express = require('express');
const app = express();
var ffmpeg = require('fluent-ffmpeg');

function startJob(jobId, inputPath, outputPath) {
  console.log("Running transcode job " + jobId)
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
  console.log('Received POST for /job/transcode');
  console.log('parameter: ' + req.query.mediaId);
  const jobId = getRandomInt(1024); // Generate random number for the jobId (can be improved)
  startJob(jobId, "test/video/sample_video/4K.mp4", "test/video/output_video/1.mp4"); // Run the transcode
  res.end(JSON.stringify({ jobId: jobId })); // Return jobId as JSON
});

// Get status of a transcode job
app.get('/job/progress', function(req, res) {
  console.log('Received GET for /job/transcode');
  console.log('parameter: ' + parseInt(req.query.jobId));
  res.end(JSON.stringify({ progress: jobs.get(parseInt(req.query.jobId)) })); // Return progress as JSON
});

app.listen(8080, function() {
  console.log('Example app listening on port 8080!');
});