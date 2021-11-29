'use strict';

const Stream = require('stream');
const Transform = Stream.Transform;
const Util = require('util');
const Utils = require('./utils');


const internals = {};


internals.Transformer = exports.Transformer = function (options, objectMode) {

    options = options || {};
    this.counter = 1;
    this.event = options.event || null;
    this.generateId = options.generateId || function () {

        return this.counter++;
    };
    Transform.call(this, { objectMode });
};


Util.inherits(exports.Transformer, Transform);


internals.Transformer.prototype._transform = function (chunk, encoding, callback) {

    const event = {
        id: this.generateId(chunk),
        data: chunk
    };

    if (chunk.event || this.event) {
        event.event = chunk.event || this.event;
    }

    this.push(Utils.stringifyEvent(event));
    callback();
};


internals.Transformer.prototype._flush = function (callback) {

    this.push(Utils.stringifyEvent({ event: 'end', data: '' }));
    callback();
};
