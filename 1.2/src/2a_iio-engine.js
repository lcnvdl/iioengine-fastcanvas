// ============================
//  iio Engine :: Definition of iio package
// ============================
var iio = {};
(function (iio)
{
    //iio.isiPad = navigator.userAgent.match(/iPad/i) != null;

    function emptyFn() {};
    
    //   FAST CANVAS HELPER
    //  @lcnvdl
    iio.__newImage = function () {
        if(typeof FastCanvas !== 'undefined')
            return FastCanvas.createImage();
        else
            return new Image();
    };
    //  @lcnvdl
    iio.__newCanvas = function (ifNotFastCanvas) {
        if(typeof FastCanvas !== 'undefined')
            return FastCanvas.create();
        else {
            var c = document.createElement("canvas");
            ifNotFastCanvas(c);
            
            return c;
        }
    };
    //  END
    
    iio.maxInt = 9007199254740992;
    iio.inherit = function (child, parent)
    {
        var tmp = child;
        emptyFn.prototype = parent.prototype;
        child.prototype = new emptyFn;
        child.prototype.constructor = tmp;
    };
    iio.start = function (app, id, w, h)
    {
        if (typeof app == 'undefined') throw new Error("iio.start: No application script provided");
        if (typeof iio.apps == 'undefined') iio.apps = [];
        iio.apps[iio.apps.length] = new iio.AppManager(app, id, w, h);
        return iio.apps[iio.apps.length - 1];
    }
    iio.stop = function (app)
    {
        if (iio.isNumber(app)) iio.apps.splice(app, 1);
        else for (var i = 0; i < iio.apps.length; i++)
        if (iio.apps[i] == app) iio.apps.splice(i, 1);

    }
    iio.requestTimeout = function (fps, lastTime, callback, callbackParams)
    {
        //Callback method by Erik Möller, Paul Irish, Tino Zijdel
        //https://gist.github.com/1579671
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, (1000 / fps) - (currTime - lastTime));
        callbackParams[0].fsID = setTimeout(function ()
        {
            callback(currTime + timeToCall, callbackParams);
        }, timeToCall);
        lastTime = currTime + timeToCall;
    }
    /* iio Functions
     */
    iio.loadImage = function (src, onload)
    {
        var img = iio.__newImage(); //new Image(); /* @lcnvdl */
        img.src = src;
        img.onload = onload;
        return img;
    }
    //  @lcnvdl
    iio.isNumber = function (o) {
        if (typeof o === 'number')  {
            return true;
        }
        return (o - 0) == o && o.length > 0;
    }
    iio.isString = function (s)
    {
        return typeof s == 'string' || s instanceof String;
    }
    iio.isBetween = function (val, min, max)
    {
        if (max < min)
        {
            var tmp = min;
            min = max;
            max = tmp;
        }
        return (val >= min && val <= max);
    }
    iio.addEvent = function (obj, evt, fn, capt)
    {
        if (obj.addEventListener)
        {
            obj.addEventListener(evt, fn, capt);
            return true;
        }
        else if (obj.attachEvent)
        {
            obj.attachEvent('on' + evt, fn);
            return true;
        }
        else return false;
    }
    iio.delayCall = function (delay, fn, fnParams)
    {
        setTimeout(function ()
        {
            fn(fnParams)
        }, delay);
    }
    iio.rotatePoint = function (x, y, r)
    {
        if (typeof x.x != 'undefined')
        {
            r = y;
            y = x.y;
            x = x.x;
        }
        if (typeof r == 'undefined' || r == 0) return new iio.Vec(x, y);
        var newX = x * Math.cos(r) - y * Math.sin(r);
        var newY = y * Math.cos(r) + x * Math.sin(r);
        return new iio.Vec(newX, newY);
    }
    iio.getRandomNum = function (min, max)
    {
        min = min || 0;
        max = max || 1;
        return Math.random() * (max - min) + min;
    }
    iio.getRandomInt = function (min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    iio.getRandomColor = function ()
    {
        var r = Math.floor(Math.random() * (255 - 0) + 0);
        var g = Math.floor(Math.random() * (255 - 0) + 0);
        var b = Math.floor(Math.random() * (255 - 0) + 0);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    iio.getVecsFromPointList = function (points)
    {
        var vecs = [];
        for (var i = 0; i < points.length; i++)
        {
            if (typeof points[i].x != 'undefined') vecs[vecs.length] = new iio.Vec(points[i]);
            else
            {
                vecs[vecs.length] = new iio.Vec(points[i], points[i + 1]);
                i++;
            }
        }
        return vecs;
    }
    iio.getCentroid = function (vecs)
    {
        var cX, cY;
        for (var i = 0; i < vecs.length; i++)
        {
            cX += vecs[i].x;
            cY += vecs[i].y;
        }
        return new iio.Vec(cX / vecs.length, cY / vecs.length);
    }
    iio.getSpecVertex = function (vertices, comparator)
    {
        var v = vertices[0];
        for (var i = 0; i < vertices.length; i++)
        if (comparator(v, vertices[i])) v = vertices[i];
        return v;
    }
    iio.lineContains = function (l1, l2, p)
    {
        if (iio.isBetween(p.x, l1.x, l2.x) && iio.isBetween(p.y, l1.y, l2.y))
        {
            var a = (l2.y - l1.y) / (l2.x - l1.x);
            if (!isFinite(a))
            {
                return true;
            }
            var y = a * (x - l1.x) + l1.y;
            if (y == p.y)
            {
                return true;
            }
        }
        return false;
    }
    iio.intersects = function (obj1, obj2)
    {
        if (obj1 instanceof iio.SimpleRect)
        {
            if (obj2 instanceof iio.SimpleRect) return iio.rectXrect(obj1, obj2);
            if (obj2 instanceof iio.Circle) return iio.polyXcircle(obj1, obj2);
            if (obj2 instanceof iio.Poly) return iio.polyXpoly(obj1, obj2);
        }
        if (obj1 instanceof iio.Poly)
        {
            if (obj2 instanceof iio.Circle) return iio.polyXcircle(obj1, obj2);
            if (obj2 instanceof iio.Poly) return iio.polyXpoly(obj1, obj2, obj1.getTrueVertices(), obj2.getTrueVertices());
        }
        if (obj1 instanceof iio.Circle)
        {
            if (obj2 instanceof iio.Circle) return iio.circleXcircle(obj1, obj2);
            if (obj2 instanceof iio.Poly) return iio.polyXcircle(obj2, obj1);
        }
    }
    iio.lineXline = function (v1, v2, v3, v4)
    {
        var a1 = (v2.y - v1.y) / (v2.x - v1.x);
        var a2 = (v4.y - v3.y) / (v4.x - v3.x);
        var a = a1;
        var x1 = v1.x;
        var y1 = v1.y;
        var i1 = !isFinite(a1);
        var i2 = !isFinite(a2);
        var x;
        if (i1 || i2)
        {
            if (i1 && i2)
            {
                return v1.x === v3.x && (iio.isBetween(v1.y, v3.y, v4.y) || iio.isBetween(v2.y, v3.y, v4.y) || iio.isBetween(v3.y, v1.y, v2.y) || iio.isBetween(v4.y, v1.y, v2.y));
            }
            if (i1)
            {
                x = v1.x;
                a = a2;
                x1 = v3.x;
                y1 = v3.y;
            }
            else
            {
                x = v3.x;
            }
        }
        else
        {
            x = (a1 * v1.x - a2 * v3.x - v1.y + v3.y) / (a1 - a2);
            if (!isFinite(x))
            {
                return (iio.isBetween(v1.x, v3.x, v4.x) && iio.isBetween(v1.y, v3.y, v4.y) || iio.isBetween(v2.x, v3.x, v4.x) && iio.isBetween(v2.y, v3.y, v4.y) || iio.isBetween(v3.x, v1.x, v2.x) && iio.isBetween(v3.y, v1.y, v2.y) || iio.isBetween(v4.x, v1.x, v2.x) && iio.isBetween(v4.y, v1.y, v2.y));
            }
        }
        var y = a * (x - x1) + y1;
        if (iio.isBetween(x, v1.x, v2.x) && iio.isBetween(x, v3.x, v4.x) && iio.isBetween(y, v1.y, v2.y) && iio.isBetween(y, v3.y, v4.y))
        {
            return true;
        }
        return false;
    }
    iio.rectXrect = function (r1, r2)
    {
        if (r1.left() < r2.right() && r1.right() > r2.left() && r1.top() < r2.bottom() && r1.bottom() > r2.top()) return true;
        return false;
    }
    iio.polyXpoly = function (p1, p2)
    {
        var v1 = p1.getTrueVertices();
        var v2 = p2.getTrueVertices();
        for (i = 0; i < v1.length; i++)
        if (p2.contains(v1[i])) return true;
        for (i = 0; i < v2.length; i++)
        if (p1.contains(v2[i])) return true;
        var a, b, j;
        for (i = 0; i < v1.length; i++)
        {
            a = iio.Vec.add(v1[i], p1.pos);
            b = iio.Vec.add(v1[(i + 1) % v1.length], p1.pos);
            for (j = 0; j < v2.length; j++)
            {
                if (iio.lineXline(a, b, iio.Vec.add(v2[j], p2.pos), iio.Vec.add(v2[(j + 1) % v2.length], p2.pos)))
                {
                    return true;
                }
            }
        }
        return false;
    }
    iio.circleXcircle = function (c1, c2)
    {
        if (c1.pos.distance(c2.pos) < c1.radius + c2.radius) return true;
        return false;
    }
    iio.polyXcircle = function (poly, circle)
    {
        var v = poly.getTrueVertices();
        var i;
        for (i = 0; i < v.length; i++)
        if (circle.contains(v[i])) return true;
        var j;
        for (i = 0; i < v.length; i++)
        {
            j = i + 1;
            if (j == v.length) j = 0;
            if (circle.lineIntersects(v[i], v[j])) return true;
        }
        return false;
    }
    iio.getKeyString = function (e)
    {
        switch (e.keyCode)
        {
        case 8:
            return 'backspace';
        case 9:
            return 'tab';
        case 13:
            return 'enter';
        case 16:
            return 'shift';
        case 17:
            return 'ctrl';
        case 18:
            return 'alt';
        case 19:
            return 'pause';
        case 20:
            return 'caps lock';
        case 27:
            return 'escape';
        case 32:
            return 'space';
        case 33:
            return 'page up';
        case 34:
            return 'page down';
        case 35:
            return 'end';
        case 36:
            return 'home';
        case 37:
            return 'left arrow';
        case 38:
            return 'up arrow';
        case 39:
            return 'right arrow';
        case 40:
            return 'down arrow';
        case 45:
            return 'insert';
        case 46:
            return 'delete';
        case 48:
            return '0';
        case 49:
            return '1';
        case 50:
            return '2';
        case 51:
            return '3';
        case 52:
            return '4';
        case 53:
            return '5';
        case 54:
            return '6';
        case 55:
            return '7';
        case 56:
            return '8';
        case 57:
            return '9';
        case 65:
            return 'a';
        case 66:
            return 'b';
        case 67:
            return 'c';
        case 68:
            return 'd';
        case 69:
            return 'e';
        case 70:
            return 'f';
        case 71:
            return 'g';
        case 72:
            return 'h';
        case 73:
            return 'i';
        case 74:
            return 'j';
        case 75:
            return 'k';
        case 76:
            return 'l';
        case 77:
            return 'm';
        case 78:
            return 'n';
        case 79:
            return 'o';
        case 80:
            return 'p';
        case 81:
            return 'q';
        case 82:
            return 'r';
        case 83:
            return 's';
        case 84:
            return 't';
        case 85:
            return 'u';
        case 86:
            return 'v';
        case 87:
            return 'w';
        case 88:
            return 'x';
        case 89:
            return 'y';
        case 90:
            return 'z';
        case 91:
            return 'left window';
        case 92:
            return 'right window';
        case 93:
            return 'select key';
        case 96:
            return 'n0';
        case 97:
            return 'n1';
        case 98:
            return 'n2';
        case 99:
            return 'n3';
        case 100:
            return 'n4';
        case 101:
            return 'n5';
        case 102:
            return 'n6';
        case 103:
            return 'n7';
        case 104:
            return 'n8';
        case 105:
            return 'n9';
        case 106:
            return 'multiply';
        case 107:
            return 'add';
        case 109:
            return 'subtract';
        case 110:
            return 'dec';
        case 111:
            return 'divide';
        case 112:
            return 'f1';
        case 113:
            return 'f2';
        case 114:
            return 'f3';
        case 115:
            return 'f4';
        case 116:
            return 'f5';
        case 117:
            return 'f6';
        case 118:
            return 'f7';
        case 119:
            return 'f8';
        case 120:
            return 'f9';
        case 121:
            return 'f10';
        case 122:
            return 'f11';
        case 123:
            return 'f12';
        case 144:
            return 'num lock';
        case 156:
            return 'scroll lock';
        case 186:
            return 'semi-colon';
        case 187:
            return 'equal';
        case 188:
            return 'comma';
        case 189:
            return 'dash';
        case 190:
            return 'period';
        case 191:
            return 'forward slash';
        case 192:
            return 'grave accent';
        case 219:
            return 'open bracket';
        case 220:
            return 'back slash';
        case 221:
            return 'close bracket';
        case 222:
            return 'single quote';
        default:
            return 'undefined';
        }
    }
    iio.keyCodeIs = function (key, event)
    {
        if (!(key instanceof Array)) key = [key];
        var str = iio.getKeyString(event);
        for (var _k = 0; _k < key.length; _k++)
        {
            if (str == key[_k]) return true;
        }
        return false;
    }
    if (typeof soundManager != 'undefined')
    {
        iio.playSound = function (url)
        {
            var SFX;
            SFX = soundManager.createSound(
            {
                url: url
            });
            SFX.play(
            {
                onfinish: function ()
                {
                    this.destruct()
                }
            });
        }
        iio.loadSound = function (url, fn)
        {
            var callback = fn;
            var s = soundManager.createSound(
            {
                url: url,
                onload: function ()
                {
                    soundManager._writeDebug(this.id + ' loaded');
                    callback();
                }
            });
        }
    }
})(iio);
