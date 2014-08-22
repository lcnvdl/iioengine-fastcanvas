// ============================
//  Line
// ============================
(function ()
{
    //Definition

    function Line()
    {
        this.Line.apply(this, arguments);
    };
    iio.Line = Line;
    iio.inherit(Line, iio.Obj)

    //Constructor
    Line.prototype._super = iio.Obj.prototype;
    Line.prototype.Line = function (p1, p2, p3, p4)
    {
        this._super.Obj.call(this, p1, p2);
        if (p1 instanceof iio.Vec)
        {
            if (p2 instanceof iio.Vec) this.endPos = new iio.Vec(p2);
            else this.endPos = new iio.Vec(p2, p3);
        }
        else if (p3 instanceof iio.Vec) this.endPos = new iio.Vec(p3);
        else this.endPos = new iio.Vec(p3, p4)
    }

    //Functions
    Line.prototype.clone = function ()
    {
        return new Line(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
    }
    Line.prototype.set = function (line, end, x2, y2)
    {
        if (line instanceof iio.Line)
        {
            this.pos.x = line.pos.x;
            this.pos.y = line.pos.y;
            this.endPos.x = line.endPos.x;
            this.endPos.y = line.endPos.y;
        }
        else if (line instanceof iio.Vec)
        {
            this.pos.x = line.x;
            this.pos.y = line.y;
            this.endPos.x = end.x;
            this.endPos.y = end.y;
        }
        else
        {
            this.pos.x = line;
            this.pos.y = end;
            this.endPos.x = x2;
            this.enPos.y = y2;
        }
    }
    Line.prototype.setDash = function (da)
    {
        if (typeof da == 'undefined') this.dashed = undefined;
        else this.dashed = true;
        this.dashProperties = da;
        return this;
    }
    Line.prototype.setEndPos = function (v, y)
    {
        if (v instanceof iio.Vec) this.endPos = v;
        else this.endPos = new iio.Vec(v || 0, y || 0);
    }
})();

// ============================
//  MultiLine
// ============================
(function ()
{
    //Definition

    function MultiLine()
    {
        this.MultiLine.apply(this, arguments);
    };
    iio.MultiLine = MultiLine;
    iio.inherit(MultiLine, iio.Line)

    //Constructor
    MultiLine.prototype._super = iio.Line.prototype;
    MultiLine.prototype.MultiLine = function (points)
    {
        this.vertices = iio.getVecsFromPointList(points);
        this._super.Line.call(this, this.vertices[0], this.vertices[this.vertices.length - 1]);
    }

    //Functions
    MultiLine.prototype.clone = function ()
    {
        return new MultiLine(this.vertices);
    }
})();


// ============================
//  Text
// ============================
(function ()
{
    //Definition

    function Text()
    {
        this.Text.apply(this, arguments);
    };
    iio.Text = Text;
    iio.inherit(Text, iio.Obj)

    //Constructor
    Text.prototype._super = iio.Obj.prototype;
    Text.prototype.Text = function (text, v, y)
    {
        this._super.Obj.call(this, v, y);
        this.text = text;
    }

    //Functions
    Text.prototype.clone = function ()
    {
        var t = new Text(this.text, this.pos).setFont(this.font).setTextAlign(this.textAlign).setWrap(this.wrap).setLineHeight(this.lineheight);
        return t;
    }
    Text.prototype.keyboardEdit = function (e, cI, shift, fn)
    {
        var key = iio.getKeyString(e);
        var str;
        var pre = this.text.substring(0, cI);
        var suf = this.text.substring(cI);
        if (typeof fn != 'undefined')
        {
            str = fn(key, shift, pre, suf);
            if (str != false)
            {
                this.text = pre + str + suf;
                return cI + 1;
            }
        }
        if (key.length > 1)
        {
            if (key == 'backspace')
            {
                this.text = pre.substring(0, pre.length - 1) + suf;
                return cI - 1;
            }
            if (key == 'delete')
            {
                this.text = pre + suf.substring(1);
                return cI;
            }
            if (key == 'semi-colon')
            {
                if (shift) this.text = pre + ':' + suf;
                else this.text = pre + ';' + suf;
                cI++;
            }
            if (key == 'equal')
            {
                if (shift) this.text = pre + '+' + suf;
                else this.text = pre + '=' + suf;
                cI++;
            }
            if (key == 'comma')
            {
                if (shift) this.text = pre + '<' + suf;
                else this.text = pre + ',' + suf;
                cI++;
            }
            if (key == 'dash')
            {
                if (shift) this.text = pre + '_' + suf;
                else this.text = pre + '-' + suf;
                cI++;
            }
            if (key == 'period')
            {
                if (shift) this.text = pre + '>' + suf;
                else this.text = pre + '.' + suf;
                cI++;
            }
            if (key == 'forward slash')
            {
                if (shift) this.text = pre + '?' + suf;
                else this.text = pre + '/' + suf;
                cI++;
            }
            if (key == 'grave accent')
            {
                if (shift) this.text = pre + '~' + suf;
                else this.text = pre + '`' + suf;
                cI++;
            }
            if (key == 'open bracket')
            {
                if (shift) this.text = pre + '{' + suf;
                else this.text = pre + '[' + suf;
                cI++;
            }
            if (key == 'back slash')
            {
                if (shift) this.text = pre + '|' + suf;
                else this.text = pre + "/" + suf;
                cI++;
            }
            if (key == 'close bracket')
            {
                if (shift) this.text = pre + '}' + suf;
                else this.text = pre + ']' + suf;
                cI++;
            }
            if (key == 'single quote')
            {
                if (shift) this.text = pre + '"' + suf;
                else this.text = pre + "'" + suf;
                cI++;
            }
            if (key == 'space')
            {
                this.text = pre + " " + suf;
                cI++;
            }
        }
        else
        {
            if (shift) this.text = pre + key.charAt(0).toUpperCase() + suf;
            else this.text = pre + key + suf;
            cI++;
        }
        return cI;
    }
    Text.prototype.getX = function (ctx, i)
    {
        var tt = this.text.substring(0, i);
        ctx.font = this.font;
        var w = ctx.measureText(tt).width;
        return this.left() + ctx.measureText(tt).width;
    }
    Text.prototype.setText = function (t)
    {
        this.text = t;
        return this;
    }
    Text.prototype.addText = function (t)
    {
        this.text = this.text + t;
        return this;
    }
    Text.prototype.setFont = function (f)
    {
        this.font = f;
        return this;
    }
    Text.prototype.setWrap = function (w)
    {
        this.wrap = w;
        return this;
    }
    Text.prototype.setLineHeight = function (l)
    {
        this.lineheight = l;
        return this;
    }
    Text.prototype.setTextAlign = function (tA)
    {
        this.textAlign = tA;
        return this;
    }
})();

// ============================
//  Shape
// ============================
(function ()
{
    //Definition

    function Shape()
    {
        this.Shape.apply(this, arguments);
    };
    iio.Shape = Shape;
    iio.inherit(Shape, iio.Obj)

    //Constructor
    Shape.prototype._super = iio.Obj.prototype;
    Shape.prototype.Shape = function (v, y)
    {
        this._super.Obj.call(this, v, y);
    }
    //Functions
    Shape.prototype.clone = function ()
    {
        return new Shape(this.pos);
    }
    Shape.prototype.setRotationAxis = function (v, y)
    {
        if (v instanceof iio.Vec) this.rAxis = v.clone();
        else this.rAxis = new iio.Vec(v, y);
        return this;
    }
})();

// ============================
//  SimpleRect
// ============================
(function ()
{
    //Definition

    function SimpleRect()
    {
        this.SimpleRect.apply(this, arguments);
    };
    iio.SimpleRect = SimpleRect;
    iio.inherit(SimpleRect, iio.Shape)

    //Constructor
    SimpleRect.prototype._super = iio.Shape.prototype;
    SimpleRect.prototype.SimpleRect = function (v, y, w, h)
    {
        this._super.Shape.call(this, v, y);
        if (typeof v != 'undefined' && typeof v.x != 'undefined')
        {
            this.width = y || 0;
            this.height = w || y || 0;
        }
        else
        {
            this.width = w || 0;
            this.height = h || w || 0;
        }
    }
    //Functions
    SimpleRect.prototype.clone = function ()
    {
        return new SimpleRect(this.pos, this.width, this.height);
    }
    SimpleRect.prototype.left = function ()
    {
        return this.pos.x - this.width / 2;
    }
    SimpleRect.prototype.right = function ()
    {
        return this.pos.x + this.width / 2;
    }
    SimpleRect.prototype.top = function ()
    {
        return this.pos.y - this.height / 2;
    }
    SimpleRect.prototype.bottom = function ()
    {
        return this.pos.y + this.height / 2;
    }
    SimpleRect.prototype.setSize = function (v, y)
    {
        if (typeof v.x != 'undefined')
        {
            this.width = v.x || 0;
            this.height = v.y || 0;
        }
        else
        {
            this.width = v || 0;
            this.height = y || 0;
        }
        return this;
    }
    SimpleRect.prototype.contains = function (v, y)
    {
        y = v.y || y;
        v = v.x || v;
        v -= this.pos.x;
        y -= this.pos.y;
        // Check relative to center of rectangle
        if (v > -0.5 * this.width && v < 0.5 * this.width && y > -0.5 * this.height && y < 0.5 * this.height)
        {
            return true;
        }
        return false;
    }
    SimpleRect.prototype.getTrueVertices = function ()
    {
        return iio.getVecsFromPointList([this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.pos.x + this.width / 2, this.pos.y - this.height / 2, this.pos.x + this.width / 2, this.pos.y + this.height / 2, this.pos.x - this.width / 2, this.pos.y + this.height / 2])
    }
})();

// ============================
//  Circle
// ============================
(function ()
{
    //Definition

    function Circle()
    {
        this.Circle.apply(this, arguments);
    };
    iio.Circle = Circle;
    iio.inherit(Circle, iio.Shape)

    //Constructor
    Circle.prototype._super = iio.Shape.prototype;
    Circle.prototype.Circle = function (v, y, r)
    {
        this._super.Shape.call(this, v, y);
        if (typeof v == 'undefined' || typeof v.x != 'undefined') this.radius = y || 0;
        else this.radius = r || 0;
    }
    //Functions
    Circle.prototype.clone = function ()
    {
        return new Circle(this.pos, this.radius);
    }
    Circle.prototype.left = function ()
    {
        return this.pos.x - this.radius;
    }
    Circle.prototype.right = function ()
    {
        return this.pos.x + this.radius;
    }
    Circle.prototype.top = function ()
    {
        return this.pos.y - this.radius;
    }
    Circle.prototype.bottom = function ()
    {
        return this.pos.y + this.radius;
    }
    Circle.prototype.setRadius = function (r)
    {
        this.radius = r || 0;
        return this
    }
    Circle.prototype.contains = function (v)
    {
        if (v.distance(this.pos) < this.radius) return true;
        return false;
    }
    Circle.prototype.lineIntersects = function (v1, v2)
    {
        var a = (v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y);
        var b = 2 * ((v2.x - v1.x) * (v1.x - this.pos.x) + (v2.y - v1.y) * (v1.y - this.pos.y));
        var cc = this.pos.x * this.pos.x + this.pos.y * this.pos.y + v1.x * v1.x + v1.y * v1.y - 2 * (this.pos.x * v1.x + this.pos.y * v1.y) - this.radius * this.radius;
        var deter = b * b - 4 * a * cc;
        if (deter > 0)
        {
            var e = Math.sqrt(deter);
            var u1 = (-b + e) / (2 * a);
            var u2 = (-b - e) / (2 * a);
            if (!((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1))) return true;
        }
        return false;
    }
})();

// ============================
//  Poly
// ============================
(function ()
{
    //Definition

    function Poly()
    {
        this.Poly.apply(this, arguments);
    };
    iio.Poly = Poly;
    iio.inherit(Poly, iio.Shape)

    //Constructor
    Poly.prototype._super = iio.Shape.prototype;
    Poly.prototype.Poly = function (p, p2, p3)
    {
        if (typeof p.x != 'undefined')
        {
            this._super.Shape.call(this, p);
            this.vertices = iio.getVecsFromPointList(p2);
        }
        else if (p instanceof Array)
        {
            this.vertices = iio.getVecsFromPointList(p);
            this.pos = new iio.Vec();
            this.styles = {};
        }
        else
        {
            this._super.Shape.call(this, p, p2);
            this.vertices = iio.getVecsFromPointList(p3);
        }
        this.originToLeft = iio.getSpecVertex(this.vertices, function (v1, v2)
        {
            if (v1.x > v2.x) return true;
            return false
        }).x;
        this.originToTop = iio.getSpecVertex(this.vertices, function (v1, v2)
        {
            if (v1.y > v2.y) return true;
            return false
        }).y;
        this.width = iio.getSpecVertex(this.vertices, function (v1, v2)
        {
            if (v1.x < v2.x) return true;
            return false
        }).x - this.originToLeft;
        this.height = iio.getSpecVertex(this.vertices, function (v1, v2)
        {
            if (v1.y < v2.y) return true;
            return false
        }).y - this.originToTop;
    }
    //Functions
    Poly.prototype.clone = function ()
    {
        return new Poly(this.pos, this.vertices);
    }
    Poly.prototype.left = function ()
    {
        return iio.getSpecVertex(this.getTrueVertices(), function (v1, v2)
        {
            if (v1.x > v2.x) return true;
            return false
        }).x
    }
    Poly.prototype.right = function ()
    {
        return iio.getSpecVertex(this.getTrueVertices(), function (v1, v2)
        {
            if (v1.x < v2.x) return true;
            return false
        }).x
    }
    Poly.prototype.top = function ()
    {
        return iio.getSpecVertex(this.getTrueVertices(), function (v1, v2)
        {
            if (v1.y > v2.y) return true;
            return false
        }).y
    }
    Poly.prototype.bottom = function ()
    {
        return iio.getSpecVertex(this.getTrueVertices(), function (v1, v2)
        {
            if (v1.y < v2.y) return true;
            return false
        }).y
    }
    Poly.prototype.contains = function (v, y)
    {
        y = (v.y || y);
        v = (v.x || v);
        var i = j = c = 0;
        var vertices = this.getTrueVertices();
        for (i = 0, j = vertices.length - 1; i < vertices.length; j = i++)
        {
            if (((vertices[i].y > y) != (vertices[j].y > y)) && (v < (vertices[j].x - vertices[i].x) * (y - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x)) c = !c;
        }
        return c;
    }
    Poly.prototype.getTrueVertices = function ()
    {
        var vList = [];
        var x, y;
        for (var i = 0; i < this.vertices.length; i++)
        {
            x = this.vertices[i].x;
            y = this.vertices[i].y;
            var v = iio.rotatePoint(x, y, this.rotation);
            v.x += this.pos.x;
            v.y += this.pos.y;
            vList[i] = v;
        }
        return vList;
    }
})();

// ============================
//  Rect
// ============================
(function ()
{
    //Definition

    function Rect()
    {
        this.Rect.apply(this, arguments);
    };
    iio.Rect = Rect;
    iio.inherit(Rect, iio.Poly)

    //Constructor
    Rect.prototype._super = iio.Poly.prototype;
    Rect.prototype.Rect = function (x, y, w, h)
    {
        if (typeof x != 'undefined' && typeof x.x != 'undefined')
        {
            h = w || y || 0;
            w = y || 0;
            y = x.y;
            x = x.x;
        }
        else
        {
            h = h || w || 0;
            w = w || 0;
            x = x || 0;
            y = y || 0;
        }
        this._super.Poly.call(this, x, y, [-w / 2, -h / 2, w / 2, -h / 2, w / 2, h / 2, -w / 2, h / 2]);
    }
    //Functions
    Rect.prototype.clone = function ()
    {
        return new Rect(this.pos, this.width, this.height);
    }
    Rect.prototype.setSize = function (w, h)
    {
        h = h || w.y || w || 0;
        w = w.x || w || 0;
        this.height = h;
        this.width = w;
        this.originToLeft = -this.width / 2;
        this.originToTop = -this.height / 2;
        this.vertices = iio.getVecsFromPointList([-w / 2, -h / 2, w / 2, -h / 2, w / 2, h / 2, -w / 2, h / 2])
        return this;
    }
})();

//XShape
(function ()
{
    //Definition

    function XShape()
    {
        this.XShape.apply(this, arguments);
    };
    iio.XShape = XShape;
    iio.inherit(XShape, iio.SimpleRect)

    //Constructor
    XShape.prototype._super = iio.Rect.prototype;
    XShape.prototype.XShape = function (v, y, w, h)
    {
        this._super.Rect.call(this, v, y, w, h);
    }
    //Functions
    XShape.prototype.clone = function ()
    {
        return new XShape(this.pos, this.width, this.height);
    }
})();