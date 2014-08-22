// ============================
//  Vec
// ============================
(function ()
{
    //Definition

    function Vec()
    {
        this.Vec.apply(this, arguments);
    };
    iio.Vec = Vec;

    //Constructor
    Vec.prototype.Vec = function (v, y)
    {
        if (typeof v != 'undefined' && typeof v.x != 'undefined')
        {
            this.x = v.x || 0;
            this.y = v.y || 0;
        }
        else
        {
            this.x = v || 0;
            this.y = y || 0;
        }
    }
    //Functions
    Vec.prototype.clone = function ()
    {
        return new Vec(this.x, this.y);
    }
    Vec.prototype.toString = function ()
    {
        return "x:" + this.x + " y:" + this.y;
    }
    Vec.toString = function (v)
    {
        return "x:" + v.x + " y:" + v.y;
    }
    Vec.prototype.set = function (v, y)
    {
        if (typeof v.x != 'undefined')
        {
            this.x = v.x;
            this.y = v.y;
        }
        else
        {
            this.x = v;
            this.y = y;
        }
        return this;
    }
    Vec.prototype.length = function ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    Vec.length = function (v, y)
    {
        if (typeof v.x != 'undefined') return Math.sqrt(v.x * v.x + v.y * v.y);
        else return Math.sqrt(v * v + y * y);
    }
    Vec.prototype.add = function (v, y)
    {
        if (typeof v.x != 'undefined')
        {
            this.x += v.x;
            this.y += v.y;
        }
        else
        {
            this.x += v;
            this.y += y;
        }
        return this;
    }
    Vec.add = function (v1, v2, x2, y2)
    {
        if (typeof v1.x != 'undefined') return (new Vec(v1)).add(v2, x2);
        else return (new Vec(v1, v2)).add(x2, y2);
    }
    Vec.prototype.sub = function (v, y)
    {
        if (typeof v.x != 'undefined') this.add(-v.x, -v.y);
        else this.add(-v, -y);
        return this;
    }
    Vec.sub = function (v1, v2, x2, y2)
    {
        if (typeof v1.x != 'undefined') return (new Vec(v1)).sub(v2, x2)
        else return (new Vec(v1, v2)).sub(x2, y2);
    }
    Vec.prototype.mult = function (f)
    {
        this.x *= f;
        this.y *= f;
        return this;
    }
    Vec.mult = function (v, y, f)
    {
        if (typeof v.x != 'undefined') return (new Vec(v)).mult(y);
        else return (new Vec(v, y)).mult(f);
    }
    Vec.prototype.div = function (d)
    {
        this.x /= d;
        this.y /= d;
        return this;
    }
    Vec.div = function (v, y, f)
    {
        if (typeof v.x != 'undefined') return (new Vec(v)).div(y)
        else return (new Vec(v, y)).div(f);
    }
    Vec.prototype.dot = function (v, y)
    {
        if (typeof v.x != 'undefined') return this.x * v.x + this.y * v.y;
        else return this.x * v + this.y * y;
    }
    Vec.dot = function (v1, v2, x2, y2)
    {
        if (typeof v1.x != 'undefined')
        {
            if (typeof v2.x != 'undefined') return v1.x * v2.x + v1.y * v2.y;
            else return v1.x * v2 + v1.y * x2;
        }
        else
        {
            if (typeof x2.x != 'undefined') return v1 * x2.x + v2 * x2.y;
            else return v1 * x2 + v2 * y2;
        }
    }
    Vec.prototype.normalize = function ()
    {
        this.div(this.length());
        return this;
    }
    Vec.normalize = function (v, y)
    {
        return (new Vec(v, y)).normalize();
    }
    Vec.prototype.lerp = function (v, y, p)
    {
        if (typeof v.x != 'undefined') this.add(Vec.sub(v, this).mult(y));
        else this.add(Vec.sub(v, y, this).mult(p));
        return this;
    }
    Vec.lerp = function (v1, v2, x2, y2, p)
    {
        if (typeof v1.x != 'undefined') return (new Vec(v1)).lerp(v2, x2, y2);
        else return (new Vec(v1, v2)).lerp(x2, y2, p);
    }
    Vec.prototype.distance = function (v, y)
    {
        if (typeof v.x != 'undefined') return Math.sqrt((v.x - this.x) * (v.x - this.x) + (v.y - this.y) * (v.y - this.y));
        else return Math.sqrt((v - this.x) * (v - this.x) + (y - this.y) * (y - this.y));
    }
    Vec.distance = function (v1, v2, x2, y2)
    {
        if (typeof v1.x != 'undefined')
        {
            if (typeof v2.x != 'undefined') return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
            else return Math.sqrt((v1.x - v2) * (v1.x - v2) + (v1.y - x2) * (v1.y - x2));
        }
        else
        {
            if (typeof x2.x != 'undefined') return Math.sqrt((v1 - x2.x) * (v1 - x2.x) + (v2 - x2.y) * (v2 - x2.y));
            else return Math.sqrt((v1 - x2) * (v1 - x2) + (v2 - y2) * (v2 - y2));
        }
    }
})();

