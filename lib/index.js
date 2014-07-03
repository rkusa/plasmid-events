var namespace = 'e'

module.exports = function(opts) {
  if (!opts) opts = {}

  return function(host) {
    if (host.opts.ordering === 'depth') {
      throw new Error('plasmid-events only work when `ordering` is set to `breadth`')
    }

    if (host.state.opts.history === false) {
      throw new Error('plasmid-events only works when syncing the whole history')
    }

    host.on('update', function(obj) {
      if (obj.k[0] === namespace) {
        var emitter = opts.emitter || host
        emitter.emit.apply(emitter, [obj.k[1]].concat(obj.v))
        if (opts.received) opts.received()
      }
    })

    host.event = function() {
      var args = Array.prototype.slice.call(arguments)
      var event = args.shift()
      this.set(event, args, namespace)
      if (opts.emitted) opts.emitted()
    }
  }
}