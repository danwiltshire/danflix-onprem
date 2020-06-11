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

app.get('/media/:id', function(req, res) {
  console.log('Received GET for /media/:id');
  res.sendStatus(404);
});

app.post('/job/transcode/:id', function(req, res) {
  console.log('Received POST for /job/transcode/:id');
  TranscodeJob("tests/video/sample_video/1.mkv", "tests/video/output_video/test.mp4")
  res.sendStatus(200);
});

app.listen(8080, function() {
  console.log('Example app listening on port 8080!');
});
