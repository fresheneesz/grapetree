// based on ideas from https://github.com/QubitProducts/cherrytree

var proto = require('proto')
var GrapeTreeCore = require('grapetree-core')

module.exports = proto(GrapeTreeCore, function(superclass) {

    // static

    // routerDefinition should be a function that gets a Route object as its `this` context
    this.init = function(routerDefinition) {
        superclass.init.apply(this, arguments)

        var that = this
        superclass.transformPath.call(this, {
            toExternal: function(internalPath) {
                var result = '/'+internalPath.join('/')
                if(that.transform2 !== undefined) {
                    result = that.transform2.toExternal(result)
                }
                return result
            },
            toInternal: function(externalPath) {
                if(that.transform2 !== undefined) {
                    externalPath = that.transform2.toInternal(externalPath)
                }

                if(externalPath.indexOf('/') === 0) {
                    externalPath = externalPath.slice(1)
                }

                var result = externalPath.split('/')
                for(var n=0; n<externalPath.length; n++) {
                    if(result[n] === '{}') {
                        result[n] = GrapeTreeCore.param
                    }
                }

                return result
            }
        })
    }

    // instance

    // sets up a transform function to transform paths before they are passed to `default` handlers and 'go' events
    this.transformPath = function(transform) {
        this.transform2 = transform
    }


    // private

    this.transform2; // transform variable that doesn't conflict with the one inherited from grapetree-core
})