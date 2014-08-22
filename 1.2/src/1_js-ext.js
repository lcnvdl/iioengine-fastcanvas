// ============================
//  JavaScript Extensions
// ============================
(function ()
{
    if (!Array.prototype.forEach)
    {
        Array.prototype.forEach = function (fn)
        {
            var keepGoing = true;
            for (var c = 0; c < this.length; c++)
            for (var r = 0; r < this[c].length; r++)
            {
                keepGoing = fn(this[c][r], c, r);
                if (typeof keepGoing != 'undefined' && !keepGoing) return [r, c];
            }
        }
    }
    if (!Array.prototype.insert)
    {
        Array.prototype.insert = function (index, item)
        {
            this.splice(index, 0, item);
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id)
        {
            clearTimeout(id);
        };
    }
    //Method by Rod MacDougall
    //stackoverflow.com/questions/4576724/dotted-stroke-in-canvas
    var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (CP.lineTo) {
        CP.dashedLine = CP.dashedLine || 
            function (x, y, x2, y2, da)
            {
                if (!da) da = [10, 5];
                this.save();
                var dx = (x2 - x),
                    dy = (y2 - y);
                var len = Math.sqrt(dx * dx + dy * dy);
                var rot = Math.atan2(dy, dx);
                this.translate(x, y);
                this.moveTo(0, 0);
                this.rotate(rot);
                var dc = da.length;
                var di = 0,
                    draw = true;
                x = 0;
                while (len > x)
                {
                    x += da[di++ % dc];
                    if (x > len) x = len;
                    draw ? this.lineTo(x, 0) : this.moveTo(x, 0);
                    draw = !draw;
                }
                this.restore();
            }
        ;
    }
})();