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
                this.enter(function() {
                    t.eq(param, '3')
                })
            })
        })

        var n=0
        router.on('change', function(newPath) { // router is an EventEmitter
            if(n===0) {
                t.eq(newPath, '/xx')
            } else if(n===1) {
                t.eq(newPath, '/xx/ww')
            } else if(n===2) {
                t.eq(newPath, '/yy/zz/3')
            } else {
                throw new Error("not supposed to get here: "+newPath)
            }

            n++
        })

        router.go('/xx').done()
        router.go('/xx/ww').done()
        router.go('/yy/zz/3').done()
        router.go('/yy/zz/ww/ss').catch(function(e) {
            t.eq(e.message, 'No route matched path: "/yy/zz/ww/ss"')
        }).done()

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

        router.go('"""/x"""').done()
        router.go('"""/x/y/z"""').done()
        router.go('"""/x/w"""').done()
    })

    this.test('pass-through route', function(t) {

        var n=0, event = function(event) {
            n++
            if(n===1) {
                t.eq(event, "entered []")
            } else if(n===2) {
                t.eq(event, "entered b")
            } else if(n===3) {
                t.eq(event, "entered a")
            } else if(n===4) {
                t.eq(event, "entered []")
            } else if(n===5) {
                t.eq(event, "entered b")
            } else {
                throw new Error("unexpected event")
            }
        }

        var router1 = Router(function() {
            this.route('a', function() {
                this.enter(function() {
                    event("entered a")
                })
            })
            this.route('/', function() {
                this.enter(function() {
                    event("entered []")
                })

                this.route('b', function() {
                    this.enter(function() {
                        event("entered b")
                    })
                })
            })
        })

        router1.go('b', undefined, true).done()
        router1.go('a', undefined, true).done()
        router1.go('b', undefined, true).done()
    })

    //*/


}).writeConsole()



