# danflix-onprem
On-premise component of DanFlix

## HTTP endpoints

### GET /job/transcode
Gets the progress of the ffmpeg transcode job.  Unrounded percentage out of 100.

#### Parameters
- ?jobId - Returned by POST /job/transcode

### POST /job/transcode
Creates a transcode job.  Returns a job ID.