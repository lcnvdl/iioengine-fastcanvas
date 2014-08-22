// ============================
//  iio Kinematics Engine
// ============================
(function ()
{
    function updateProperties(obj, dt)
    {
        if ((typeof obj.acc != 'undefined' && obj.acc.length() > 0) || (typeof obj.vel != 'undefined' && obj.vel.length() > 0) || (typeof obj.torque != 'undefined' && obj.torque > 0)) obj.clearDraw();
        if (typeof obj.acc != 'undefined')
        {
            if (typeof obj.vel == 'undefined') obj.setVel();
            obj.vel.add(obj.acc);
        }
        if (typeof obj.vel != 'undefined') obj.translate(new iio.Vec(obj.vel.x, obj.vel.y));
        if (typeof obj.torque != 'undefined')
        {
            obj.rotation += obj.torque;
            if (obj.rotation > 2 * Math.PI) obj.rotation -= 2 * Math.PI;
            else if (obj.rotation < -2 * Math.PI) obj.rotation += 2 * Math.PI;
        }
        if (obj.shrinkRate > 0)
        {
            if (typeof obj.radius != 'undefined')
            {
                obj.setRadius(obj.radius * (1 - obj.shrinkRate));
                if (Math.abs(obj.radius < .1)) return false;
            }
            else
            {
                obj.setSize(obj.width * (1 - obj.shrinkRate), obj.height * (1 - obj.shrinkRate));
                if (Math.abs(obj.width < .1) && Math.abs(obj.height < .1)) return false;
            }
        }
        if (obj.bounds != null)
        {
            var top = obj.top() || (obj.pos.y - obj.radius) || 0;
            if (typeof obj.bounds.top != 'undefined' && top < obj.bounds.top.val)
            {
                if (typeof obj.bounds.top.callback != 'undefined') return obj.bounds.top.callback(obj) || false;
                return false;
            }

            var right = obj.right() || (obj.pos.x + obj.radius) || 0;
            if (typeof obj.bounds.right != 'undefined' && right > obj.bounds.right.val)
            {
                if (typeof obj.bounds.right.callback != 'undefined') return obj.bounds.right.callback(obj) || false;
                return false;
            }

            var bottom = obj.bottom() || (obj.pos.y + obj.radius) || 0;
            if (typeof obj.bounds.bottom != 'undefined' && bottom > obj.bounds.bottom.val)
            {
                if (typeof obj.bounds.bottom.callback != 'undefined') return obj.bounds.bottom.callback(obj) || false;
                return false;
            }

            var left = obj.left() || (obj.pos.x - obj.radius) || 0;
            if (typeof obj.bounds.left != 'undefined' && left < obj.bounds.left.val)
            {
                if (typeof obj.bounds.left.callback != 'undefined') return obj.bounds.left.callback(obj) || false;
                return false;
            }
        }
        return true;
    }

    function setVel(v, y)
    {
        this.vel = new iio.Vec(v, y);
        return this
    }

    function setAcc(v, y)
    {
        this.acc = new iio.Vec(v, y);
        return this
    }

    function setTorque(t)
    {
        this.torque = t;
        if (typeof this.rotation == 'undefined') this.rotation = 0;
        return this;
    }

    function setBound(direction, value, callback)
    {
        if (typeof this.bounds == 'undefined') this.bounds = {};
        if (direction == 'top')
        {
            this.bounds.top = {};
            this.bounds.top.val = value;
            this.bounds.top.callback = callback;
        }
        else if (direction == 'right')
        {
            this.bounds.right = {};
            this.bounds.right.val = value;
            this.bounds.right.callback = callback;
        }
        else if (direction == 'bottom')
        {
            this.bounds.bottom = {};
            this.bounds.bottom.val = value;
            this.bounds.bottom.callback = callback;
        }
        else if (direction == 'left')
        {
            this.bounds.left = {};
            this.bounds.left.val = value;
            this.bounds.left.callback = callback;
        }
        return this;
    }

    function setBounds(top, right, bottom, left, callback)
    {
        this.bounds = {};
        if (typeof top != 'undefined')
        {
            this.bounds.top = {};
            this.bounds.top.val = top;
            this.bounds.top.callback = callback;
        }
        if (typeof right != 'undefined')
        {
            this.bounds.right = {};
            this.bounds.right.val = right;
            this.bounds.right.callback = callback;
        }
        if (typeof bottom != 'undefined')
        {
            this.bounds.bottom = {};
            this.bounds.bottom.val = bottom;
            this.bounds.bottom.callback = callback;
        }
        if (typeof left != 'undefined')
        {
            this.bounds.left = {};
            this.bounds.left.val = left;
            this.bounds.left.callback = callback;
        }
        return this;
    }

    function shrink(s)
    {
        this.shrinkRate = s;
        return this;
    }

    function stopKinematics()
    {
        this.vel = this.acc = this.torque = this.bounds = undefined;
    }

    function enableKinematics()
    {
        //this.update=updateProperties;
        this.enableUpdates(updateProperties);
        this.setVel = setVel;
        this.setAcc = setAcc;
        this.setTorque = setTorque;
        this.setBounds = setBounds;
        this.setBound = setBound;
        this.shrink = shrink;
        this.stopKinematics = stopKinematics;
        return this;
    }
    iio.Shape.prototype.enableKinematics = enableKinematics;
    iio.Text.prototype.enableKinematics = enableKinematics;
})();