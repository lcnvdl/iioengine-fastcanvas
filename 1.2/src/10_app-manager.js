// ============================
//  AppManager
// ============================
(function ()
{
    //Definition

    function AppManager()
    {
        this.AppManager.apply(this, arguments);
    };
    iio.AppManager = AppManager;

    /* CONSTRUCTORS
     * App(app) //attaches full screen canvas to body
     * App(app, w, h) //attaches wxh canvas to body
     * App(app, canvasId) //assigns app to given canvas
     * App(app, elementId, w, h) //attaches wxh canvas to elementId
     */
    AppManager.prototype.AppManager = function (app, id, w, h)
    {
        this.cnvs = [];
        this.ctxs = [];
        
        if (typeof app == 'undefined') 
            throw new Error("iio.start: No app provided");
            
        if (typeof w == 'undefined' && iio.isString(id)) {
            this.addCanvas(id);
        }
        else
        {
            if (iio.isString(id))
            {
                if (id == 'auto')
                {
                    h = w || 'auto';
                    w = id;
                    id = 'body';
                }
                else
                {
                    w = w || 'auto';
                    h = h || 'auto';
                    if (id != 'body' && !document.getElementById(id)) 
                        throw new Error("iio.start: Invalid element id");
                }
            }
            else
            {
                h = w || 'auto';
                w = id || 'auto';
            }
            this.addCanvas(0, w, h, id);
        }
        this.canvas = this.cnvs[0];
        this.context = this.ctxs[0];
        this.app = new app(this);
        this.addWindowListeners();
    }
    
    // ===============================
    //  APP CONTROL FUNCTIONS
    // ===============================
    AppManager.prototype.setFramerate = function (fps, callback, obj, ctx)
    {
        if (typeof callback != 'undefined' && typeof callback.draw != 'undefined')
        {
            if (typeof ctx != 'undefined') var realCallback = ctx;
            ctx = obj || this.ctxs[0];
            obj = callback;
            callback = realCallback ||
            function ()
            {};
            obj.ctx = ctx;
        }
        else obj = obj || 0;
        if (iio.isNumber(obj)) obj = this.cnvs[obj];
        if (typeof obj.lastTime == 'undefined') obj.lastTime = 0;
        if (typeof ctx != 'undefined') obj.ctx = ctx;
        iio.requestTimeout(fps, obj.lastTime, function (dt, args)
        {
            if (!args[1].pause)
            {
                args[0].lastTime = dt;
                args[1].setFramerate(fps, args[2], args[0]);
                if (typeof args[0].update != 'undefined') args[0].update(dt);
                if (typeof args[2] != 'undefined') args[2](dt);
                if (args[0].redraw)
                {
                    args[0].draw();
                    args[0].redraw = false;
                }
            }
            else args[1].setFramerate(fps, args[2], args[0]);
        }, [obj, this, callback]);
        return this;
    }
    AppManager.prototype.setNoDrawFramerate = function (fps, callback, obj, ctx)
    {
        if (typeof callback != 'undefined' && typeof callback.draw != 'undefined')
        {
            if (typeof ctx != 'undefined') var realCallback = ctx;
            ctx = obj || this.ctxs[0];
            obj = callback;
            callback = realCallback ||
            function ()
            {};
            obj.ctx = ctx;
        }
        else obj = obj || 0;
        if (iio.isNumber(obj)) obj = this.cnvs[obj];
        if (typeof obj.lastTime == 'undefined') obj.lastTime = 0;
        if (typeof ctx != 'undefined') obj.ctx = ctx;
        iio.requestTimeout(fps, obj.lastTime, function (dt, args)
        {
            if (!args[1].pause)
            {
                args[0].lastTime = dt;
                args[1].setNoDrawFramerate(fps, args[2], args[0]);
                if (typeof args[0].update != 'undefined') args[0].update(dt);
                if (typeof args[2] != 'undefined') args[2](dt);
            }
            else args[1].setNoDrawFramerate(fps, args[2], args[0]);
        }, [obj, this, callback]);
        return this;
    }
    AppManager.prototype.pauseFramerate = function (pause, obj)
    {
        var o = obj || this;
        if (typeof pause == 'undefined')
        {
            if (typeof o.pause == 'undefined') o.pause = true;
            else o.pause = !o.pause;
        }
        else o.pause = pause;
        return o;
    }
    AppManager.prototype.cancelFramerate = function (c)
    {
        if (c instanceof iio.Obj)
        {
            clearTimeout(c.fsID);
            return c;
        }
        else
        {
            c = c || 0;
            clearTimeout(this.cnvs[c].fsID);
        }
    }
    AppManager.prototype.setCursorStyle = function (style, c)
    {
        this.cnvs[c || 0].style.cursor = style || 'default';
        return this;
    }
    
    //DEPRECATED: will be removed in future version, replaced by 'Shape.playAnim'
    AppManager.prototype.setAnimFPS = function (fps, obj, c)
    {
        c = c || 0;
        if (obj instanceof Array) this.setFramerate(fps, function ()
        {
            for (var i = 0; i < obj.length; i++)
            obj[i].nextAnimFrame()
        }, obj, this.ctxs[c]);
        else this.setFramerate(fps, function ()
        {
            obj.nextAnimFrame()
        }, obj, this.ctxs[c]);
        return this;
    }
    AppManager.prototype.setB2Framerate = function (fps, callback)
    {
        if (typeof this.b2lastTime == 'undefined') this.b2lastTime = 0;
        if (typeof this.b2World != 'undefined' && !this.b2Pause) this.b2World.Step(1 / this.fps, 10, 10);
        iio.requestTimeout(fps, this.b2lastTime, function (dt, args)
        {
            args[0].b2lastTime = dt;
            args[0].setB2Framerate(fps, callback);
            if (typeof args[0].b2World != 'undefined' && !args[0].b2Pause) args[0].b2World.Step(1 / fps, 10, 10);
            callback(dt);
            if (typeof args[0].b2DebugDraw != 'undefined' && args[0].b2DebugDraw) args[0].b2World.DrawDebugData();
            else args[0].draw(args[0].b2Cnv);
            if (typeof this.b2World != 'undefined') args[0].b2World.ClearForces();
        }, [this]);
        return this;
    }
    AppManager.prototype.pauseB2World = function (pause)
    {
        if (typeof pause == 'undefined')
        {
            if (typeof this.b2Pause == 'undefined') this.b2Pause = true;
            else this.b2Pause = !this.b2Pause;
        }
        else this.b2Pause = pause;
    }
    AppManager.prototype.addB2World = function (world, c)
    {
        this.b2World = world;
        this.b2Scale = 30;
        this.b2Cnv = c || 0;
        return world;
    }
    
    // ===============================
    //  CANVAS CONTROL FUNCTIONS
    // ===============================
    AppManager.prototype.update = function (dt)
    {
        for (var c = 0; c < this.cnvs.length; c++)
        this.cnvs[c].update(dt);
    }
    AppManager.prototype.draw = function (i)
    {
        if (typeof i == 'undefined') 
            for (var c = 0; c < this.cnvs.length; c++)
                this.cnvs[c].draw(this.b2Scale);
        else 
            this.cnvs[i].draw(this.b2Scale);
            
        return this;
    }
    AppManager.prototype.addCanvas = function (zIndex, w, h, attachId, cssClasses)
    {
        var i = this.cnvs.length,
            $this = this;
        
        if (iio.isString(zIndex))
        {
            if (!document.getElementById(zIndex)) 
                throw new Error("AppManager.addCanvas: Invalid canvas id '" + zIndex + "'");
            this.cnvs[i] = document.getElementById(zIndex);
            this.ctxs[i] = this.cnvs[i].getContext('2d');
            if (typeof this.cnvs[i].getContext == 'undefined') 
                throw new Error("AppManager.addCanvas: given id did not correspond to a canvas object");
            this.setCanvasProperties(i);
            this.setCanvasFunctions(i);
            this.addFocusListeners(i);
            return i;
        }

        //should fit to element, not window
        if (w == 'auto') w = window.innerWidth;
        if (h == 'auto') h = window.innerHeight;

        //Create the canvas
        /*this.cnvs[i] = document.createElement('canvas');
        this.cnvs[i].width = w || this.cnvs[0].width;
        this.cnvs[i].height = h || this.cnvs[0].height;
        this.cnvs[i].style.zIndex = zIndex || -i;*/
        
        //Create the canvas @lcnvdl
        this.cnvs[i] = iio.__newCanvas(function(c) {
            //c.width = w || $this.cnvs[0].width;
            //c.height = h || $this.cnvs[0].height;
            //c.style.zIndex = zIndex || -i;
        });
        
        
        this.cnvs[i].width = w || this.cnvs[0].width;
        this.cnvs[i].height = h || this.cnvs[0].height;
        this.cnvs[i].style.zIndex = zIndex || -i;

        //Attach the canvas
        if (iio.isString(attachId))
        {
            if (attachId == 'body') 
                document.body.appendChild(this.cnvs[i])
            else 
                document.getElementById(attachId).appendChild(this.cnvs[i])
        }
        else if (this.cnvs.length > 1)
        {
            this.cnvs[i].style.position = "absolute";
            var offset = this.getCanvasOffset();
            this.cnvs[i].style.left = offset.x + "px";
            this.cnvs[i].style.top = offset.y + "px";
            this.cnvs[i].style.margin = 0;
            this.cnvs[i].style.padding = 0;
            this.cnvs[0].parentNode.appendChild(this.cnvs[i]);
        }
        else {
            document.body.appendChild(this.cnvs[i]);
        }
        
        this.cnvs[i].className += "ioCanvas";

        if (attachId instanceof Array) 
            for (var j = 0; j < attachId.length; j++)
                this.cnvs[i].className += " " + attachId[j];
        if (cssClasses instanceof Array) 
            for (var j = 0; j < cssClasses.length; j++)
                this.cnvs[i].className += " " + cssClasses[j];
        else if (iio.isString(cssClasses)) 
            this.cnvs[i].className += " " + cssClasses;

        //TODO define specific display options and put styles back when app is terminated
        //also make everything relative to parent element instead of directly 'body'
        if (this.cnvs[i].width == window.innerWidth && this.cnvs[i].height == window.innerHeight)
        {
            this.cnvs[i].style.display = "block"; //remove scrollbars
            this.cnvs[i].style.position = "absolute";
            this.cnvs[i].style.top = 0;
            document.body.style.overflow = 'hidden';
        }
        if (this.cnvs[i].width == window.innerWidth)
        {
            document.body.style.marginLeft = document.body.style.marginRight = document.body.style.paddingLeft = document.body.style.paddingRight = "0";
            this.fullWidth = true;
        }
        if (this.cnvs[i].height == window.innerHeight)
        {
            document.body.style.marginTop = document.body.style.marginBottom = document.body.style.paddingTop = document.body.style.paddingBottom = "0";
            this.fullHeight = true;
        }
        this.ctxs[i] = this.cnvs[i].getContext('2d');
        this.setCanvasProperties(i);
        this.setCanvasFunctions(i);
        this.addFocusListeners(i);
        return i;
    }
    AppManager.prototype.disableContextMenu = function (c)
    {
        c = c || 0;
        this.cnvs[c].oncontextmenu = function ()
        {
            return false
        };
    }
    AppManager.prototype.disableStaticCollisionChecks = function (c)
    {
        this.cnvs[c || 0].disableStaticCollisions = true;
        return this;
    }
    AppManager.prototype.setOnContextMenu = function (fn, c)
    {
        c = c || 0;
        this.cnvs[c].oncontextmenu = fn;
    }
    AppManager.prototype.setCanvasFunctions = function (c)
    {
        this.ctxs[c].webkitImageSmoothingEnabled = true;

        this.cnvs[c].draw = function (scale)
        {
            this.getContext('2d').clearRect(0, 0, this.width, this.height);
            if (typeof this.groups != 'undefined') 
                for (var i = 0; i < this.groups.length; i++)
                    this.groups[i].draw(this.getContext('2d'), scale);
        }
        this.cnvs[c].update = function (dt)
        {
            if (typeof (this.groups) != 'undefined') for (var i = this.groups.length - 1; i >= 0; i--)
            {
                this.groups[i].update(dt);
                var j = 0;
                while (typeof (this.groups[i].collisionTags) != 'undefined' && j < this.groups[i].collisionTags.length)
                {
                    this.checkCollisions(this.groups[i], this.groups[this.indexOfTag(this.groups[i].collisionTags[j].tag)], this.groups[i].collisionTags[j].callback);
                    j++;
                }
                if (this.groups[i].redraw)
                    this.redraw = true;
            }
        }
        this.cnvs[c].indexOfTag = function (tag)
        {
            if (typeof (this.groups) != 'undefined') for (var i = 0; i < this.groups.length; i++)
            if (this.groups[i].tag == tag) return i;
            return 'NO';
        }
        this.cnvs[c].checkCollisions = function (group1, group2, callback)
        {
            if (group1 == group2)
            {
                var cPairs = [];
                var alreadyDealtWith;
                var q, p;
            }
            for (var i = 0; i < group1.objs.length; i++)
            for (var j = 0; j < group2.objs.length; j++)
            if (typeof (group1.objs[i]) != 'undefined' && group1.objs[i] != group2.objs[j] && !(typeof this.disableStaticCollisions != 'undefined' && this.disableStaticCollisions && (typeof group1.objs[i].vel == 'undefined' && typeof group2.objs[j].vel == 'undefined') && !((typeof group1.objs[i].vel != 'undefined' && group1.objs[i].vel.length() != 0) && (typeof group2.objs[j].vel != 'undefined' && group2.objs[j].vel.length() != 0))) && iio.intersects(group1.objs[i], group2.objs[j]))
            {
                if (cPairs instanceof Array)
                {
                    alreadyDealtWith = false;
                    for (p = 0; p < cPairs.length; p++)
                    if (i == cPairs[p][0] && j == cPairs[p][1] || i == cPairs[p][1] && j == cPairs[p][0]) alreadyDealtWith = true;
                    if (!alreadyDealtWith)
                    {
                        q = cPairs.length;
                        cPairs[q] = [];
                        cPairs[q][0] = i;
                        cPairs[q][1] = j;
                        callback(group1.objs[i], group2.objs[j]);
                    }
                }
                else callback(group1.objs[i], group2.objs[j]);
            }
        }
    }
    AppManager.prototype.setCanvasProperties = function (c)
    {
        this.cnvs[c].pos = this.getCanvasOffset(c);
        this.cnvs[c].center = new iio.Vec(this.cnvs[c].width / 2, this.cnvs[c].height / 2);
    }
    AppManager.prototype.addFocusListeners = function (i)
    {
        this.focused = false;
        this.cnvs[i].addEventListener('mouseover', function (event)
        {
            this[0].focused = true;
            if (typeof this[0].app.focusOn != 'undefined') this[0].app.focusOn(event, i);
        }.bind([this, i]), false)
        this.cnvs[i].addEventListener('mouseout', function (event)
        {
            this[0].focused = false;
            if (typeof this[0].app.focusOff != 'undefined') this[0].app.focusOff(event, i);
        }.bind([this, i]), false)
    }
    AppManager.prototype.addWindowListeners = function ()
    {
        iio.addEvent(window, 'resize', function (event)
        {
            if (this.fullWidth) this.canvas.width = window.innerWidth;
            if (this.fullHeight) this.canvas.height = window.innerHeight;
            for (var c = 0; c < this.cnvs.length; c++)
            {
                this.setCanvasProperties(c);
                if (c > 0)
                {
                    this.cnvs[c].style.left = this.cnvs[0].offsetLeft + "px";
                    this.cnvs[c].style.top = this.cnvs[0].offsetTop + "px";
                }

            }
            if (typeof this.app.onResize != 'undefined') this.app.onResize(event);
        }.bind(this), false);
        iio.addEvent(window, 'scroll', function (event)
        {
            for (var c = 0; c < this.cnvs.length; c++)
            this.setCanvasProperties(c);
            if (typeof this.app.onScroll != 'undefined') this.app.onScroll(event);
        }.bind(this), false);
    }
    AppManager.prototype.drawPartialPixels = function (turnOn)
    {
        turnOn = turnOn || true;
        if (turnOn) this.partialPixels = true;
        else this.partialPixels = false;
        return this;
    }
    AppManager.prototype.activateB2Debugger = function (turnOn, c)
    {
        turnOn = turnOn || true;
        c = c || 0;
        if (turnOn)
        {
            this.b2DebugDraw = new Box2D.Dynamics.b2DebugDraw();
            this.b2DebugDraw.SetSprite(this.ctxs[c]);
            this.b2DebugDraw.SetDrawScale(this.b2Scale);
            this.b2DebugDraw.SetFillAlpha(0.5)
            this.b2DebugDraw.SetLineThickness(1.0)
            this.b2DebugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit)
            this.b2World.SetDebugDraw(this.b2DebugDraw);
            return this.b2DebugDraw;
        }
    }

    // ===============================
    //  SOUND CONTROL
    // ===============================
    AppManager.prototype.playSound = function (pathToSound)
    {
        if (typeof this.muted == 'undefined' || !this.muted) iio.playSound(pathToSound);
        return this;
    }
    AppManager.prototype.mute = function (yes)
    {
        if (typeof this.muted == 'undefined') this.muted = true;
        if (typeof yes != 'undefined') this.muted = yes;
        return this;
    }

    // ===============================
    //  GROUP CONTROL FUNCTIONS
    // ===============================
    AppManager.prototype.addGroup = function (tag, zIndex, c)
    {
        c = c || 0;
        if (typeof (this.cnvs[c].groups) == 'undefined') this.cnvs[c].groups = [];
        var z = zIndex || 0;
        var i = this.indexFromzIndexInsertSort(z, this.cnvs[c].groups);
        this.cnvs[c].groups.insert(i, new iio.Group(tag, z));
        return i;
    }
    AppManager.prototype.addToGroup = function (tag, obj, zIndex, c)
    {
        c = c || 0;
        var i = this.indexOfTag(tag, c);
        var a = iio.isNumber(i);
        if (typeof (this.cnvs[c].groups) == 'undefined' || !a) i = this.addGroup(tag, zIndex, c);
        this.cnvs[c].groups[i].addObj(obj, c);
        if (typeof this.fps == 'undefined' && typeof obj.pos != 'undefined') obj.draw(this.ctxs[c]);
        return obj;
    }
    AppManager.prototype.getGroup = function (tag, c, from, to)
    {
        c = c || 0;
        var i = this.indexOfTag(tag, c),
            a = iio.isNumber(i);

        if (typeof (this.cnvs[c].groups) == 'undefined' || !a) return false;
        var objs = this.cnvs[c].groups[i].objs;

        if (typeof (from) !== 'undefined' && from >= 0)
        {
            to = to || (from + 1);
            return objs.slice(from, to);
        }
        return objs;
    }
    AppManager.prototype.addObj = function (obj, zIndex, c)
    {
        c = c || 0;
        if (typeof (this.cnvs[c].groups) == 'undefined') this.cnvs[c].groups = [];
        zIndex = zIndex || 0;
        for (var i = 0; i < this.cnvs[c].groups.length; i++)
        if (this.cnvs[c].groups[i].tag == 0)
        {
            this.cnvs[c].groups[i].addObj(obj);
            if (typeof this.fps == 'undefined' && typeof obj.pos != 'undefined') obj.draw(this.ctxs[c]);
            return obj;
        }
        this.addGroup(zIndex, zIndex, c);
        this.addToGroup(zIndex, obj, zIndex, c);
        if (typeof this.fps == 'undefined' && typeof obj.pos != 'undefined') obj.draw(this.ctxs[c]);
        return obj;
    }
    AppManager.prototype.indexFromzIndexInsertSort = function (zIndex, arr)
    {
        var i = 0;
        while (i < arr.length && arr[i].zIndex < zIndex) i++;
        return i;
    }
    AppManager.prototype.indexOfTag = function (tag, c)
    {
        c = c || 0;
        if (typeof (this.cnvs[c].groups) != 'undefined') for (var i = 0; i < this.cnvs[c].groups.length; i++)
        if (this.cnvs[c].groups[i].tag == tag) return i;
        return 'NO';
    }
    AppManager.prototype.setCollisionCallback = function (tag1, tag2, callback, c)
    {
        if (typeof callback == 'undefined' || iio.isNumber(callback))
        {
            callback = tag2;
            tag2 = tag1;
        }
        this.cnvs[c || 0].groups[this.indexOfTag(tag1)].addCollisionCallback(tag2, callback);
    }
    AppManager.prototype.rmv = function (obj, group, c)
    {
        if (iio.isNumber(group)) return this.rmvObj(obj, group);
        else if (typeof group == 'undefined')
        {
            if (iio.isString(obj)) return this.rmvGroup(obj);
            return this.rmvObj(obj);
        }
        else return this.rmvFromGroup(group, obj, c);
    }
    AppManager.prototype.delayRmv = function (time, obj, group, c)
    {
        obj.io = this;
        setTimeout(function ()
        {
            obj.io.rmv(obj, group, c)
        }, time);
    }
    AppManager.prototype.rmvObj = function (obj, c)
    {
        c = c || 0;
        if (typeof (this.cnvs[c].groups) != 'undefined') for (var i = 0; i < this.cnvs[c].groups.length; i++)
        {
            if (typeof obj.K == 'undefined')
            {
                this.cancelFramerate(obj);
                if (typeof this.cnvs[c].fps == 'undefined' && obj.clearSelf) 
                    obj.clearSelf(this.ctxs[c]);
            }
            if (this.cnvs[c].groups[i].rmvObj(obj)) return true;
        }
        return false;
    }
    AppManager.prototype.rmvGroup = function (tag, c)
    {
        c = c || 0;
        if (typeof (this.cnvs[c].groups) != 'undefined') if (typeof (this.cnvs[c].groups) != 'undefined') for (var i = 0; i < this.cnvs[c].groups.length; i++)
        if (this.cnvs[c].groups[i].tag == tag) return this.cnvs[c].groups.splice(i, 1);
    }
    AppManager.prototype.rmvAll = function (c)
    {
        if (typeof c == 'undefined')
        {
            for (c = 0; c < this.cnvs.length; c++)
            if (typeof (this.cnvs[c].groups) != 'undefined') 
                this.cnvs[c].groups = [];
        }
        else if (typeof (this.cnvs[c].groups) != 'undefined') 
            this.cnvs[c].groups = [];
            
        return this;
    }
    AppManager.prototype.rmvFromGroup = function (tag, obj, c)
    {
        if (typeof c == 'undefined')
        {
            if (iio.isNumber(obj) || typeof obj == 'undefined')
            {
                c = obj || 0;
                return this.clearGroup(tag, c);
            }
            else for (c = 0; c < this.cnvs.length; c++)
            if (typeof (this.cnvs[c].groups) != 'undefined') for (var i = 0; i < this.cnvs[c].groups.length; i++)
            if (this.cnvs[c].groups[i].tag == tag) return this.cnvs[c].groups[i].rmvObj(obj);
        }
        else if (typeof (this.cnvs[c].groups) != 'undefined') for (var i = 0; i < this.cnvs[c].groups.length; i++)
        if (this.cnvs[c].groups[i].tag == tag) return this.cnvs[c].groups[i].rmvObj(obj);
        return false;
    }
    AppManager.prototype.clearGroup = function (tag, c)
    {
        c = c || 0;
        if (typeof (this.cnvs[c].groups) != 'undefined') for (var i = 0; i < this.cnvs[c].groups.length; i++)
        if (this.cnvs[c].groups[i].tag == tag) return this.cnvs[c].groups[i].rmvAll();
    }
    
    // ===============================
    //  BG Control
    // ===============================
    AppManager.prototype.setBGColor = function (color, c)
    {
        c = c || 0;
        this.cnvs[c].style.backgroundColor = color;
        return this;
    }
    AppManager.prototype.setBGPattern = function (src, c)
    {
        c = c || 0;
        this.cnvs[c].style.backgroundImage = "url('" + src + "')";
        return this;
    }
    AppManager.prototype.setBGImage = function (src, scaled, c)
    {
        if (iio.isNumber(scaled)) c = scaled;
        else c = c || 0;
        if (scaled)
        {
            this.cnvs[c].style.backgroundRepeat = "no-repeat";
            this.cnvs[c].style.background = 'url(images/bg.jpg) no-repeat center center fixed';
            this.cnvs[c].style.WebkitBackgroundSize = 'cover';
            this.cnvs[c].style.MozBackgroundSize = 'cover';
            this.cnvs[c].style.OBackgroundSize = 'cover';
            this.cnvs[c].style.backgroundSize = 'cover';
            this.cnvs[c].style.Filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='." + src + "', sizingMethod='scale')";
            this.cnvs[c].style.MsFilter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='scale')";
        }
        else this.cnvs[c].style.backgroundRepeat = "no-repeat";
        return this.setBGPattern(src, c);
    }

    // ===============================
    //  Utility
    // ===============================
    AppManager.prototype.getEventPosition = function (event, c)
    {
        c = c || 0;
        var pos;
        if (iio.isiPad)
        {
            if (event.touches == null || event.touches.item(0) == null) return -1;
            else pos = new iio.Vec(event.touches.item(0).screenX, event.touches.item(0).screenY);
        }
        pos = new iio.Vec(event.clientX, event.clientY);
        pos.sub(this.cnvs[c].pos);
        return pos;
    }
    AppManager.prototype.getCanvasOffset = function (c)
    {
        c = c || 0;
        var p = this.cnvs[c].getBoundingClientRect();
        return new iio.Vec(p.left, p.top);
    }

    // ===============================
    //  B2D Helpers
    // ===============================
    AppManager.prototype.getB2BodyAt = function (callback, v, y)
    {
        if (typeof v.x == 'undefined') v = new Box2D.Common.Math.b2Vec2(v, y);
        var aabb = new Box2D.Collision.b2AABB();
        aabb.lowerBound.Set(v.x - 0.001, v.y - 0.001);
        aabb.upperBound.Set(v.x + 0.001, v.y + 0.001);

        function getBodyCB(fixture)
        {
            if (fixture.GetBody().GetType() != Box2D.Dynamics.b2Body.b2_staticBody) if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), v)) return fixture.GetBody();
            return false;
        }
        return this.b2World.QueryAABB(getBodyCB, aabb);
    }
})();