
//save data to file in same directory

const fs = require('fs');

module.exports = function writeFile(filename, dataArray) {
  const options = {flags: 'w', encoding: 'utf-8', mode: '0666'};
  const outFile = fs.createWriteStream(filename, options);
  const writeStream = function(stream, callback) {
    var count = 0;
    function writeChunk() {
      if (count >= dataArray.length) {
        stream.end();
        return;
      }
      var buffer = new Buffer(dataArray[count] + '\n', 'utf8');
      stream.write(buffer, function() {
        count++;
        writeChunk();
      });
    }
    writeChunk();
    stream.on('finish', callback);
  };
  writeStream(outFile, function () {
    console.log('Done writing file ' + filename);
  });
};
