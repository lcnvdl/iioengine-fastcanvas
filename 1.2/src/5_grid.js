// ============================
//  Grid
// ============================
(function ()
{
    //Definition

    function Grid()
    {
        this.Grid.apply(this, arguments);
    };
    iio.Grid = Grid;
    iio.inherit(Grid, iio.Shape)

    //Constructor
    Grid.prototype._super = iio.Obj.prototype;
    Grid.prototype.Grid = function (v, y, c, r, res, yRes)
    {
        if (typeof v.x != 'undefined')
        {
            this._super.Obj.call(this, v);
            c = y;
            r = c;
            res = r;
            yRes = res;
        }
        else this._super.Obj.call(this, v, y);
        this.set(v, y, c, r, res, yRes);
        this.resetCells();
    }

    //Functions
    Grid.prototype.clone = function ()
    {
        return new Grid(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
    }
    Grid.prototype.resetCells = function ()
    {
        this.cells = new Array(this.C);
        for (var i = 0; i < this.cells.length; i++)
        this.cells[i] = new Array(this.R);
        for (var c = 0; c < this.cells[0].length; c++)
        for (var r = 0; r < this.cells.length; r++)
        this.cells[r][c] = new Object();
    }
    Grid.prototype.getCellCenter = function (c, r, pixelPos)
    {
        if (typeof c.x != 'undefined')
        {
            if (r || false) return this.getCellCenter(this.getCellAt(c));
            return new iio.Vec(this.pos.x + c.x * this.res.x + this.res.x / 2, this.pos.y + c.y * this.res.y + this.res.y / 2);
        }
        else
        {
            if (pixelPos || false) return this.getCellCenter(this.getCellAt(c, r));
            return new iio.Vec(
            this.pos.x + c * this.res.x + this.res.x / 2, this.pos.y + r * this.res.y + this.res.y / 2);
        }
    }
    Grid.prototype.getCellAt = function (pos, y)
    {
        var cell = new iio.Vec(Math.floor((pos.x - this.pos.x) / this.res.x), Math.floor((pos.y - this.pos.y) / this.res.y));
        if (cell.x >= 0 && cell.x < this.C && cell.y >= 0 && cell.y < this.R) return cell;
        return false;
    }
    Grid.prototype.set = function (v, y, c, r, res, yRes)
    {
        if (c.tagName == "CANVAS")
        {
            this.C = parseInt(c.width / r, 10) + 1;
            this.R = parseInt(c.height / (res || r), 10) + 1;
            this.res = new iio.Vec(r, res || r)
        }
        else
        {
            this.R = r;
            this.C = c;
            this.res = new iio.Vec(res, yRes || res);
        }
        this.setPos(v, y);
    }
    Grid.prototype.forEachCell = function (fn)
    {
        var keepGoing = true;
        for (var c = 0; c < this.C; c++)
        for (var r = 0; r < this.R; r++)
        {
            keepGoing = fn(this.cells[c][r], c, r);
            if (typeof keepGoing != 'undefined' && !keepGoing) return [r, c];
        }
    }
})();