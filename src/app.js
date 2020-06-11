const express = require('express');
const app = express();
var ffmpeg = require('fluent-ffmpeg');

function TranscodeJob(inputPath, outputPath) {
  return new Promise(async (resolve, reject) => {
    return ffmpeg()
      .input(inputPath)
      .noAudio()
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  })
}

// Get media url for specified :mediaId
app.get('/media/:mediaId/url', function(req, res) {
  console.log('Received GET for /media/:id/url');
  res.sendStatus(404);
});

// Post a transcode job for specified :mediaId
app.post('/job/transcode/:mediaId', function(req, res) {
  console.log('Received POST for /job/transcode/:mediaID');
  TranscodeJob("tests/video/sample_video/1.mkv", "tests/video/output_video/test.mp4")
  res.sendStatus(200);
});

// Get status of a transcode job
app.get('/job/transcode/:jobId', function(req, res) {
  console.log('Received GET for /job/transcode/:jobId');
  res.sendStatus(200);
});

app.listen(8080, function() {
  console.log('Example app listening on port 8080!');
});
