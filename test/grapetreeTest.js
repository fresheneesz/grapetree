"use strict";

var Unit = require('deadunit')

var Router = require("../grapetree")

// NOTE: also check out grapetree-core's unit tests: https://github.com/fresheneesz/grapetree-core/blob/master/test/grapetreeCoreTest.js
Unit.test("grapetree", function(t) {

    //*
    this.test('basic stuff', function(t) {
        this.count(6)

        var router = Router(function() { // root

            this.route('xx', function() {
                this.default(function(path) {
                    t.eq(path, '/ww')
                })
            })

            this.route('yy/zz/{}', function(param) {
                t.ok(param === '3')
            })
        })

        var n=0
        router.on('go', function(newPath) { // router is an EventEmitter
            if(n===0) {
                t.eq(newPath, '/xx')
            } else if(n===1) {
                t.eq(newPath, '/xx/ww')
            } else if(n===2) {
                t.eq(newPath, '/yy/zz/3')
            } else {
                throw new Error("not supposed to get here")
            }

            n++
        })

        router.go('/xx')
        router.go('/xx/ww')
        router.go('/yy/zz/3')
        try {
            router.go('/yy/zz/ww')
        } catch(e) {
            this.eq(e.message, 'No route matched path: "/yy/zz/ww"')
        }

    })

    this.test('transform', function(t) {

        var router = Router(function() {
            this.route('"""x"""', function() {
                t.ok(true) // got here
                this.route('"""y/z"""', function() {
                    t.ok(true) // got here
                })
                this.default(function(path) {
                    t.eq(path, '"""/w"""')
                })
            })
        })

        // transforms the path for sending to the 'go' event and for the 'default'
        router.transformPath({
            toExternal: function(internalPath) {
                return '"""'+internalPath+'"""'
            },
            toInternal: function(externalPath) {
                return externalPath.slice(3).slice(0,-3)
            }
        })

        router.go('"""/x"""')
        router.go('"""/x/y/z"""')
        router.go('"""/x/w"""')
    })

    //*/


}).writeConsole()



