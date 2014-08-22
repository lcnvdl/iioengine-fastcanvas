// ============================
//  Obj
// ============================
(function ()
{
    //Definition

    function Obj()
    {
        this.Obj.apply(this, arguments);
    };
    iio.Obj = Obj;

    //Constructor
    Obj.prototype.Obj = function (v, y)
    {
        this.pos = new iio.Vec(v || 0, y || 0);
        this.styles = {};
    }

    //Functions
    Obj.prototype.clone = function ()
    {
        return new Obj(this.pos);
    }
    Obj.prototype.setPos = function (v, y)
    {
        this.redraw = true;
        this.pos = new iio.Vec(v, y);
        return this;
    }
    Obj.prototype.translate = function (v, y)
    {
        this.pos.add(v, y);
        this.redraw = true;
        if (typeof this.objs != 'undefined') for (var i = 0; i < this.objs.length; i++)
        this.objs[i].translate(v, y);
        return this;
    }
    Obj.prototype.rotate = function (r)
    {
        this.rotation = r;
        return this;
    }
    Obj.prototype.addObj = function (obj, under, ctx, v, y)
    {
        if (typeof this.objs == 'undefined') this.objs = [];
        obj.posOffset = new iio.Vec(v, y);
        obj.pos = this.pos.clone();
        if (typeof obj.posOffset != 'undefined') obj.pos.add(obj.posOffset);
        this.objs[this.objs.length] = obj;
        this._draw = this.draw;
        if (under) this.draw = function (ctx)
        {
            for (var i = 0; i < this.objs.length; i++)
            this.objs[i].draw(ctx);
            this._draw(ctx);
        }
        else this.draw = function (ctx)
        {
            this._draw(ctx);
            for (var i = 0; i < this.objs.length; i++)
            this.objs[i].draw(ctx);
        }
        if (typeof ctx != 'undefined') obj.draw(ctx);
        return this.enableUpdates();
    }
    Obj.prototype.enableUpdates = function (fn, fnParams)
    {
        this._update = this.update;
        if (typeof this._update != 'undefined') this.update = function (dt)
        {
            var keep = fn(this, fnParams);
            if (!this._update(dt) || (typeof keep != 'undefined' && !keep)) return false;
            return true;
        }
        else
        {
            this.update = function (dt)
            {
                if (typeof this.objs != 'undefined') for (var i = 0; i < this.objs.length; i++)
                {
                    if (typeof this.objs[i].update != 'undefined') this.objs[i].update(dt);
                    this.objs[i].pos.x = this.pos.x;
                    this.objs[i].pos.y = this.pos.y;
                    if (typeof this.objs[i].posOffset != 'undefined') this.objs[i].pos.add(this.objs[i].posOffset);
                }
                if (typeof this.fxFade != 'undefined')
                {
                    if (typeof this.styles == 'undefined') alert('error: styles undefined');
                    if ((this.fxFade.rate > 0 && this.fxFade.alpha > this.styles.alpha) || (this.fxFade.rate < 0 && this.fxFade.alpha < this.styles.alpha))
                    {
                        this.styles.alpha += this.fxFade.rate;
                        this.clearDraw();
                        if (this.styles.alpha < 0) this.styles.alpha = 0;
                        if (this.styles.alpha > 1) this.styles.alpha = 1;
                    }
                    else this.fxFade = undefined;
                }
                if (typeof fn != 'undefined') return fn(this, dt, fnParams);
                return true;
            }
        }
        return this;
    }
})();
