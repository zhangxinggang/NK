// Generated by CoffeeScript 1.8.0
(function() {
    var Mpeg1Muxer, VideoStream, events, util;
    util = require('util');
    events = require('events');
    Mpeg1Muxer = require('./mpeg1muxer');
    VideoStream = function(options){
        this.options=options;
        this.inputStreamStarted = false;
        this.stream = void 0;
        this.startMpeg1Stream();
        return this;
    };
    util.inherits(VideoStream,events.EventEmitter);
    VideoStream.prototype.startMpeg1Stream = function() {
        var gettingInputData, gettingOutputData, inputData, outputData, self;
        this.mpeg1Muxer = new Mpeg1Muxer(this.options);
        self = this;
        if (this.inputStreamStarted) {
            return;
        }
        this.mpeg1Muxer.on('mpeg1data', function(data) {
            // return self.emit('camdata', data); 你可以处理视频流数据
        });
        gettingInputData = false;
        inputData = [];
        gettingOutputData = false;
        outputData = [];
        this.mpeg1Muxer.on('ffmpegError', function(data) {
            var size;
            data = data.toString();
            if (data.indexOf('Input #') !== -1) {
                gettingInputData = true;
            }
            if (data.indexOf('Output #') !== -1) {
                gettingInputData = false;
                gettingOutputData = true;
            }
            if (data.indexOf('frame') === 0) {
                gettingOutputData = false;
            }
            if (gettingInputData) {
                inputData.push(data.toString());
                size = data.match(/\d+x\d+/);
                if (size != null) {
                    size = size[0].split('x');
                    if (self.options.width == null) {
                        self.options.width = parseInt(size[0], 10);
                    }
                    if (self.options.height == null) {
                        return self.options.height = parseInt(size[1], 10);
                    }
                }
            }
        });
        this.mpeg1Muxer.on('ffmpegError', function(data) {
            return global.process.stderr.write(data);
        });
        return this;
    };
    module.exports = VideoStream;
}).call(this);
