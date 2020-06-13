const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var morgan = require('morgan')
var ffmpeg = require('fluent-ffmpeg');

/**
 * Body parsing for handling HTTP POST data
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

/**
 * Use apache 'combined' format logging
 */
app.use(morgan('combined'));

/**
 * Media index
 */
let media = new Map([
  {
    1: { "path": "test/video/sample_video/4K.mp4", "title": "A 4K Cityscape" }
  }
]);


/**
 * The jobId and job progress
 */
let jobs = new Map();

function run(jobId, inputPath, outputPath) {

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

/**
 * Spawn a transcode job for the specified :mediaId
 */
app.post('/job/run', function(req, res) {

  if ( media.has( parseInt(req.body.mediaId )) ) {
    const jobId = getRandomInt(1024);
    run(jobId, "test/video/sample_video/4K.mp4", "test/video/output_video/1.mp4");
    res.end( JSON.stringify({ jobId: jobId }) );
  } else {
    res.status(404).end();
  }

});

/**
 * Get status of a transcode job for the specified :jobId
 */
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