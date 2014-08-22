// ============================
//  SpriteMap & Sprite
// ============================
(function ()
{
    //Definition

    function SpriteMap()
    {
        this.SpriteMap.apply(this, arguments);
    };
    iio.SpriteMap = SpriteMap;

    //Constructor
    SpriteMap.prototype.SpriteMap = function (src, sprW, sprH, onLoadCallback, callbackParams)
    {
        onLoadCallback = onLoadCallback || sprW ||
        function ()
        {};
        if (sprW != onLoadCallback) this.sW = sprW || 0;
        else this.sW = 0;
        this.sH = sprH || 0;
        if (typeof src.src != 'undefined')
        {
            this.srcImg = src;
            this.setSpriteRes(sprW, sprH);
        }
        else
        {
            this.srcImg = iio.__newImage(); //new Image(); /* @lcnvdl */
            this.srcImg.src = src;
            this.srcImg.onload = function ()
            {
                this.setSpriteRes(sprW, sprH);
                onLoadCallback(callbackParams);
            }.bind(this);
        }
        return this;
    }

    //Functions
    //-getSprite(row)
    //-getSprite(startIndex, endIndex)
    //-getSprite(spriteWidth, spriteHeight, row)
    //-getSprite(spriteWidth, spriteHeight, startIndex, endIndex, true)
    //-getSprite(xPos, yPos, width, height)
    SpriteMap.prototype.getSprite = function (p1, p2, p3, p4, p5)
    {
        var s = new iio.Sprite(this.srcImg);
        if (typeof p3 != 'undefined')
        {
            if (p5)
            {
                var C = this.srcImg.width / p1;
                if (typeof p4 != 'undefined') for (var i = p3; i <= p4; i++)
                s.addFrame(i % C * p1, parseInt(i / C, 10) * p2, p1, p2);
                else for (var c = 0; c <= this.C; c++)
                s.addFrame(c * p1, p3 * p2, p1, p2);
            }
            else s.addFrame(p1, p2, p3, p4);
        }
        else
        {
            if (typeof p2 != 'undefined') for (var i = p1; i <= p2; i++)
            s.addFrame(i % this.C * this.sW, parseInt(i / this.C, 10) * this.sH, this.sW, this.sH);
            else for (var c = 0; c <= this.C; c++)
            s.addFrame(c * this.sW, p1 * this.sH, this.sW, this.sH);
        }
        return s;
    }
    SpriteMap.prototype.setSpriteRes = function (w, h)
    {
        this.sH = w.y || h;
        this.sW = w.x || w;
        this.C = this.srcImg.width / this.sW;
        this.R = this.srcImg.height / this.sH;
    }

    //Sprite

    function Sprite()
    {
        this.Sprite.apply(this, arguments);
    };
    iio.Sprite = Sprite;

    //Constructor
    Sprite.prototype.Sprite = function (src)
    {
        this.src = src;
        this.frames = [];
        return this;
    }

    //Functions
    Sprite.prototype.addFrame = function (x, y, w, h)
    {
        var i = this.frames.length;
        this.frames[i] = {};
        this.frames[i].x = x;
        this.frames[i].y = y;
        this.frames[i].w = w;
        this.frames[i].h = h;
    }
})();