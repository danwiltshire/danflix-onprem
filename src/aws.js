const AWS = require('aws-sdk');

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
    var file = 'test/video/sample_video/1080p/1.mp4';
  
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