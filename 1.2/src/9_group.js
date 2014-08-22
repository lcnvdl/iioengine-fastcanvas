// ============================
//  CollisionTag
// ============================
(function ()
{
    //Definition

    function CollisionTag()
    {
        this.CollisionTag.apply(this, arguments);
    };
    iio.CollisionTag = CollisionTag;

    //Constructor
    CollisionTag.prototype.CollisionTag = function (tag, callback)
    {
        this.tag = tag;
        this.callback = callback;
    }
})();

// ============================
//  Group
// ============================
(function ()
{
    //Definition

    function Group()
    {
        this.Group.apply(this, arguments);
    };
    iio.Group = Group;

    //Constructor
    Group.prototype.Group = function (tag, zIndex)
    {
        this.tag = tag;
        this.zIndex = zIndex;
        this.objs = [];
    }

    //Functions
    Group.prototype.addObj = function (obj)
    {
        this.objs[this.objs.length] = obj;
    }
    Group.prototype.rmvObj = function (obj)
    {
        for (var i = 0; i < this.objs.length; i++) {
            if (obj == this.objs[i])
            {
                this.objs.splice(i, 1);
                if (typeof obj.m_I != 'undefined') 
                    return obj.GetWorld().DestroyBody(obj);
                return true;
            }
        }
        return false;
    }
    Group.prototype.rmvAll = function ()
    {
        this.objs = [];
        return true;
    }
    Group.prototype.addCollisionCallback = function (tag, callback)
    {
        if (typeof (this.collisionTags) == 'undefined') this.collisionTags = [];
        this.collisionTags[this.collisionTags.length] = new iio.CollisionTag(tag, callback);
    }
    Group.prototype.update = function (dt)
    {
        for (var i = this.objs.length - 1; i >= 0; i--)
        if (typeof this.objs[i] != 'undefined')
        {
            if (typeof this.objs[i].update != 'undefined' && !this.objs[i].update(dt)) 
                this.objs.splice(i, 1);
            else if (this.objs[i].redraw)
                this.redraw = true;
        }
    }
    Group.prototype.draw = function (ctx, scale)
    {
        for (var i = 0; i < this.objs.length; i++)
        {
            if (typeof this.objs[i].pos !== 'undefined') {
                this.objs[i].draw(ctx);
            }
            else  if (typeof this.objs[i].m_I !== 'undefined') {
                for (f = this.objs[i].GetFixtureList(); f; f = f.m_next)
                {
                    s = f.GetShape();
                    
                    if (typeof s.draw != 'undefined') {
                        s.draw(
                            ctx, 
                            new iio.Vec(this.objs[i].m_xf.position.x * scale, this.objs[i].m_xf.position.y * scale),
                            this.objs[i].GetAngle(),
                            scale
                        );
                    }
                }
            }
            else if (typeof this.objs[i].m_edgeA !== 'undefined')  {
                this.objs[i].draw(ctx, scale);
            }
        }
    }
})();