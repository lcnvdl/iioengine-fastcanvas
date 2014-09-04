// ============================
//  Graphics Attachments
// ============================
(function ()
{
    //STYLE FUNCTIONS

    function setLineWidth(w)
    {
        this.styles.lineWidth = w;
        return this
    }

    function setStrokeStyle(s, lW)
    {
        this.styles.strokeStyle = s;
        this.styles.lineWidth = lW || this.styles.lineWidth;
        return this;
    };

    function setAlpha(a)
    {
        this.styles.alpha = a;
        return this;
    }

    function setShadowColor(s)
    {
        this.styles.shadow.shadowColor = s;
        return this
    };

    function setShadowBlur(s)
    {
        this.styles.shadow.shadowBlur = s;
        return this
    };

    function setShadowOffset(v, y)
    {
        this.styles.shadow.shadowOffset = new iio.Vec(v, y || v);
        return this
    };

    function setFillStyle(s)
    {
        this.styles.fillStyle = s;
        return this
    };

    function setRoundingRadius(r)
    {
        this.styles.rounding = r;
        return this
    };

    function drawReferenceLine(bool)
    {
        this.styles.refLine = bool || true;
        return this
    };

    function setShadow(color, v, y, blur)
    {
        this.styles.shadow = {};
        this.styles.shadow.shadowColor = color;
        if (typeof v.x != 'undefined')
        {
            this.styles.shadow.shadowOffset = new iio.Vec(v);
            this.styles.shadow.shadowBlur = y;
        }
        else
        {
            this.styles.shadow.shadowOffset = new iio.Vec(v, y);
            this.styles.shadow.shadowBlur = blur;
        }
        return this;
    };

    function setLineCap(style)
    {
        this.styles.lineCap = style;
        return this
    };
    iio.Obj.prototype.setLineWidth = setLineWidth;
    iio.Obj.prototype.setStrokeStyle = setStrokeStyle;
    iio.Obj.prototype.setShadowColor = setShadowColor;
    iio.Obj.prototype.setShadowBlur = setShadowBlur;
    iio.Obj.prototype.setShadowOffset = setShadowOffset;
    iio.Obj.prototype.setShadow = setShadow;
    iio.Obj.prototype.setAlpha = setAlpha;
    iio.Text.prototype.setFillStyle = setFillStyle;
    iio.Shape.prototype.setFillStyle = setFillStyle;
    iio.Circle.prototype.drawReferenceLine = drawReferenceLine;
    iio.Line.prototype.setLineCap = setLineCap;
    iio.SimpleRect.prototype.setRoundingRadius = iio.Rect.prototype.setRoundingRadius = setRoundingRadius;

    //Image Functions

    function setImgOffset(v, y)
    {
        this.img.pos = new iio.Vec(v, y || v);
        return this
    };

    function setImgScale(s)
    {
        this.img.scale = s;
        return this
    };

    function setImgRotation(r)
    {
        this.img.rotation = r;
        return this
    };

    function flipImage(yes)
    {
        if (typeof yes != 'undefined') this.flipImg = yes;
        else if (typeof this.flipImg == 'undefined') this.flipImg = true;
        else this.flipImg = !this.flipImg;
        if (typeof this.fsID == 'undefined') this.clearDraw(this.ctx);
    }

    function setImgSize(v, y)
    {
        if (v == 'native') this.img.nativeSize = true;
        else this.img.size = new iio.Vec(v, y || v);
        return this
    };

    function addImage(src, onLoadCallback)
    {
        if (typeof src.src != 'undefined') this.img = src;
        else
        {
            this.img = iio.__newImage(); //new Image(); /* @lcnvdl */
            this.img.src = src;
            this.img.onload = onLoadCallback;
        }
        return this;
    }

    function addAnim(src, tag, onLoadCallback)
    {
        if (typeof this.anims == 'undefined') this.anims = [];
        if (typeof this.animKey == 'undefined') this.animKey = 0;
        if (typeof this.animFrame == 'undefined') this.animFrame = 0;
        var nI = this.anims.length;
        if (src instanceof iio.Sprite)
        {
            this.anims[nI] = src;
            this.anims[nI].tag = tag;
            return this;
        }
        this.anims[nI] = new Object();
        this.anims[nI].srcs = [];
        if (typeof tag == 'function') onLoadCallback = tag;
        else this.anims[nI].tag = tag;
        for (var j = 0; j < src.length; j++)
        {
            if (typeof src[j].src != 'undefined') this.anims[nI].srcs[j] = src[j];
            else
            {
                this.anims[nI].srcs[j] = iio.__newImage(); //new Image(); /* @lcnvdl */
                this.anims[nI].srcs[j].src = src[j];
            }
            if (j == this.animFrame && typeof onLoadCallback != 'undefined') this.anims[nI].srcs[j].onload = onLoadCallback;
        }
        return this;
    }

    function createWithImage(src, onLoadCallback)
    {
        if (typeof src.src != 'undefined')
        {
            this.img = src;
            if (typeof this.radius != 'undefined')
            {
                this.radius = src.width / 2;
            }
            else
            {
                this.width = src.width;
                this.height = src.height;
            }
        }
        else
        {
            this.img = iio.__newImage(); //new Image(); /* @lcnvdl */
            this.img.src = src;
            this.img.onload = function ()
            {
                if (typeof this.radius != 'undefined')
                {
                    this.radius = this.img.width / 2;
                }
                else
                {
                    this.width = this.img.width || 0;
                    this.height = this.img.height || 0;
                }
                if (typeof onLoadCallback != 'undefined') onLoadCallback();
            }.bind(this);
        }
        return this;
    }

    function createWithAnim(src, tag, onLoadCallback, i)
    {
        if (typeof i == 'undefined' && iio.isNumber(onLoadCallback)) i = onLoadCallback;
        i = i || 0;
        if (typeof tag == 'function')
        {
            onLoadCallback = tag;
            this.addAnim(src);
        }
        else this.addAnim(src, tag);
        if (src instanceof iio.Sprite)
        {
            this.width = src.frames[i].w;
            this.height = src.frames[i].h;
            this.animKey = 0;
            //this.anims[0].tag=tag;
            this.animFrame = i || 0;
            return this;
        }
        if (typeof src[0].src != 'undefined')
        {
            this.width = src[i].width;
            this.height = src[i].height;
        }
        else
        {
            this.animKey = 0;
            this.animFrame = i;
            this.anims[0].srcs[i].onload = function ()
            {
                this.width = this.anims[0].srcs[i].width || 0;
                this.height = this.anims[0].srcs[i].height || 0;
                if (typeof onLoadCallback != 'undefined' && !iio.isNumber(onLoadCallback)) onLoadCallback();
            }.bind(this);
        }
        return this;
    }

    function nextAnimFrame(reRender)
    {
        function resetFrame(io)
        {
            if (typeof io.onAnimComplete != 'undefined')
            {
                if (io.onAnimComplete()) io.animFrame = 0;
            }
            else io.animFrame = 0;
        }
        this.animFrame++;
        if (this.anims[this.animKey] instanceof iio.Sprite)
        {
            if (this.animFrame >= this.anims[this.animKey].frames.length) resetFrame(this);
        }
        else if (this.animFrame >= this.anims[this.animKey].srcs.length) resetFrame(this);
        if (reRender) this.clearDraw();
        else this.redraw = true;
        return this;
    }

    function setAnimFrame(i)
    {
        this.animFrame = i;
        return this;
    }

    function playAnim(tag, fps, io, draw, c, f)
    {
        if (!iio.isNumber(tag))
        {
            this.setAnimKey(tag);
            if (iio.isNumber(draw)) c = draw;
        }
        else
        {
            f = c;
            c = draw;
            draw = io;
            io = fps;
            fps = tag;
        }
        if (!iio.isNumber(c))
        {
            this.onAnimComplete = c;
            c = f || 0;
        }
        else this.onAnimComplete = f;
        if (typeof this.fsID != 'undefined') this.stopAnim();
        if (draw) io.setFramerate(fps, function ()
        {
            this.nextAnimFrame()
        }.bind(this), this, io.ctxs[c || 0]);
        io.setNoDrawFramerate(fps, function ()
        {
            this.nextAnimFrame()
        }.bind(this), this, io.ctxs[c || 0]);
        return this;
    }

    function play1Anim(tag, fps, io, draw, c, f)
    {
        return this.playAnim(tag, fps, io, draw, c, function ()
        {
            this.stopAnim();
        }.bind(this));
    }

    function stopAnim(key, ctx)
    {
        clearTimeout(this.fsID);
        this.fsID = undefined;
        this.setAnimKey(key);
        this.animFrame = 0;
        if (typeof ctx != 'undefined')
        {
            this.clearDraw(ctx);
            this.draw(ctx);
        }
        return this;
    }

    function setAnim(key, fn, frame, ctx)
    {
        if (typeof this.fsID != 'undefined')
        {
            clearTimeout(this.fsID);
            this.fsID = undefined;
        }
        if (iio.isNumber(fn))
        {
            frame = fn;
            ctx = frame;
            fn = function ()
            {};
        }
        else if (fn instanceof Array)
        {
            fn = fn[0];
            var fnParams = fn[1];
        }
        else fn = function ()
        {};
        if (typeof frame != 'undefined') if (!iio.isNumber(frame)) ctx = ctx || frame;
        this.animFrame = frame || 0;
        this.setAnimKey(key);
        if (typeof ctx != 'undefined')
        {
            this.clearDraw(ctx);
            this.draw(ctx);
        }
        if (fnParams != "undefined") fn(fnParams);
        else fn();
        return this;
    }

    function setAnimKey(key)
    {
        if (iio.isNumber(key)) this.animKey = key;
        else for (var i = 0; i < this.anims.length; i++)
        if (this.anims[i].tag == key) this.animKey = i;
        return this;
    }

    function fade(rate, opacity)
    {
        if (typeof this.update == 'undefined') this.enableUpdates();
        this.fxFade = {};
        this.fxFade.rate = rate;
        this.fxFade.alpha = opacity;
        return this;
    }

    function fadeIn(rate, opacity)
    {
        //fillStyle=fillStyle||this.styles.fillStyle;
        opacity = opacity || 1;
        return this.fade(rate, opacity);
    }

    function fadeOut(rate, opacity)
    {
        //fillStyle=fillStyle||this.styles.fillStyle;
        opacity = opacity || 0;
        return this.fade(-rate, opacity);
    }

    iio.Obj.prototype.fadeIn = fadeIn;
    iio.Obj.prototype.fadeOut = fadeOut;
    iio.Obj.prototype.fade = fade;
    iio.Shape.prototype.setImgOffset = setImgOffset;
    iio.Shape.prototype.setImgScale = setImgScale;
    iio.Shape.prototype.setImgRotation = setImgRotation;
    iio.Shape.prototype.setImgSize = setImgSize;
    iio.Shape.prototype.flipImage = flipImage;
    iio.Shape.prototype.addImage = addImage;
    iio.Shape.prototype.addAnim = addAnim;
    iio.Rect.prototype.createWithImage = iio.SimpleRect.prototype.createWithImage = createWithImage;
    iio.Circle.prototype.createWithImage = createWithImage;
    iio.Rect.prototype.createWithAnim = iio.SimpleRect.prototype.createWithAnim = createWithAnim;
    iio.Shape.prototype.nextAnimFrame = nextAnimFrame;
    iio.Shape.prototype.setAnimFrame = setAnimFrame;
    iio.Shape.prototype.setAnimKey = setAnimKey;
    iio.Shape.prototype.playAnim = playAnim;
    iio.Shape.prototype.play1Anim = play1Anim;
    iio.Shape.prototype.stopAnim = stopAnim;
    iio.Shape.prototype.setAnim = setAnim;

    //Draw Functions
    iio.Shape.prototype.clearDraw = function (ctx)
    {
        ctx = ctx || this.ctx;
        this.redraw = true;
        if (typeof this.clearSelf != 'undefined' && typeof ctx != 'undefined') this.clearSelf(ctx);
        return this;
    }
    iio.Text.prototype.clearDraw = iio.Shape.prototype.clearDraw;
    iio.Line.prototype.draw = function (ctx)
    {
        ctx = ctx || this.ctx;
        iio.Graphics.prepStyledContext(ctx, this.styles);
        if (this.dashed) iio.Graphics.drawDottedLine(ctx, this.dashProperties, this.pos, this.endPos);
        else iio.Graphics.drawLine(ctx, this.pos, this.endPos);
        ctx.restore();
        return this;
    };
    iio.MultiLine.prototype.draw = function (ctx)
    {
        ctx = ctx || this.ctx;
        iio.Graphics.prepStyledContext(ctx, this.styles);
        for (var i = 1; i < this.vertices.length; i++)
        iio.Graphics.drawLine(ctx, this.vertices[i - 1], this.vertices[i]);
        ctx.restore();
        return this;
    };
    iio.Grid.prototype.draw = function (ctx)
    {
        ctx = ctx || this.ctx;
        iio.Graphics.prepStyledContext(ctx, this.styles);
        if (!iio.Graphics.drawImage(ctx, this.img))
        {
            ctx.drawImage(this.img, this.pos.x, this.pos.y, this.res.x * this.C, this.res.y * this.R);
            ctx.restore();
        }
        for (var r = 1; r < this.R; r++)
        iio.Graphics.drawLine(ctx, this.pos.x, this.pos.y + r * this.res.y, this.pos.x + this.C * this.res.x, this.pos.y + r * this.res.y);
        for (var c = 1; c < this.C; c++)
        iio.Graphics.drawLine(ctx, this.pos.x + c * this.res.x, this.pos.y, this.pos.x + c * this.res.x, this.pos.y + this.R * this.res.y);
        ctx.restore();
        return this;
    }
    iio.XShape.prototype.draw = function (ctx)
    {
        ctx = ctx || this.ctx;
        iio.Graphics.prepStyledContext(ctx, this.styles);
        iio.Graphics.drawLine(ctx, iio.Vec.sub(this.pos, this.width / 2, this.height / 2), iio.Vec.add(this.pos, this.width / 2, this.height / 2));
        iio.Graphics.drawLine(ctx, iio.Vec.add(this.pos, this.width / 2, -this.height / 2), iio.Vec.add(this.pos, -this.width / 2, this.height / 2));
        ctx.restore();
        return this;
    }
    iio.Text.prototype.top = function ()
    {
        return this.pos.y;
    }
    iio.Text.prototype.bottom = function ()
    {
        return this.pos.y + parseInt(this.font, 10);
    }
    iio.Text.prototype.right = function ()
    {
        var result;
        
        this.ctx.save();
        this.ctx.font = this.font;
        
        if (this.textAlign == 'center') 
            result = this.pos.x + this.ctx.measureText(this.text).width / 2;
        else if (this.textAlign == 'right' || this.textAlign == 'end') 
            result = this.pos.x;
        else 
            result = this.pos.x + this.ctx.measureText(this.text).width;
            
        this.ctx.restore();
        
        return result;
    }
    iio.Text.prototype.left = function ()
    {
        var result;
        
        this.ctx.save();
        this.ctx.font = this.font;
        
        if (this.textAlign == 'center') 
            result = this.pos.x - this.ctx.measureText(this.text).width / 2;
        else if (this.textAlign == 'right' || this.textAlign == 'end') 
            result = this.pos.x - this.ctx.measureText(this.text).width;
        else 
            result = this.pos.x;
            
        this.ctx.restore();
        
        return result;
    }
    iio.Text.prototype.clearSelf = function (ctx)
    {
        this.ctx = ctx || this.ctx;
        // iio.Graphics.prepStyledContext(ctx,this.styles);
        // iio.Graphics.transformContext(ctx,this.pos,this.rotation);
        this.ctx.font = this.font;
        
        var fs = parseInt(this.font, 10);
        var m = this.ctx.measureText(this.text);
        
        if (this.textAlign == 'center') 
            return clearShape(this.ctx, this, m.width, fs, -m.width / 2, -fs / 2);
        else if (this.textAlign == 'right' || this.textAlign == 'end') 
            return clearShape(this.ctx, this, m.width, fs, -m.width, -fs / 2);
        else 
            return clearShape(this.ctx, this, m.width, fs, 0, -fs / 2);
    }
    iio.Text.prototype.draw = function (ctx)
    {
        if (typeof ctx == 'undefined') 
            return this;
            
        this.ctx = ctx || this.ctx;
        
        iio.Graphics.prepStyledContext(this.ctx, this.styles);
        iio.Graphics.transformContext(this.ctx, this.pos, this.rotation);
        
        this.ctx.font = this.font;
        this.ctx.textAlign = this.textAlign;
        
        if (typeof (this.wrap) == 'undefined' || this.wrap <= 0)
        {
            if (typeof this.styles.fillStyle != 'undefined') this.ctx.fillText(this.text, 0, 0);
            if (typeof this.styles.strokeStyle != 'undefined') this.ctx.strokeText(this.text, 0, 0);
        }
        else
        {
            var lineHeight = this.lineheight || 28;
            var words = this.text.split(' ');
            var line = '',
                y = 0,
                n = 0;
            for (; n < words.length; n++)
            {
                var testLine = line + words[n] + ' ';
                var metrics = this.ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > this.wrap)
                {
                    this.ctx.fillText(line, 0, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                }
                else
                {
                    line = testLine;
                }
            }
            this.ctx.fillText(line, 0, y);
        }
        this.ctx.restore();
        return this;
    }

    function drawRect(ctx, pos, r)
    {
        if (typeof ctx == 'undefined') return this;
        ctx = iio.Graphics.prepTransformedContext(ctx, this, pos, r);
        iio.Graphics.drawRectShadow(ctx, this);
        if (typeof this.styles != 'undefined' && typeof this.styles.rounding != 'undefined' && this.styles.rounding != 0) iio.Graphics.drawRoundedRectPath(ctx, this);
        if (!iio.Graphics.drawImage(ctx, this.img))
        {
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
        if (typeof this.anims != 'undefined')
        {
            if (this.anims[this.animKey] instanceof iio.Sprite) iio.Graphics.drawSprite(ctx, this.width, this.height, this.anims[this.animKey], this.animFrame);
            else if (!iio.Graphics.drawImage(ctx, this.anims[this.animKey].srcs[this.animFrame]))
            {
                ctx.drawImage(this.anims[this.animKey].srcs[this.animFrame], -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            }
        }
        if (typeof this.styles != 'undefined')
        {
            if (typeof this.styles.fillStyle != 'undefined') ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            if (typeof this.styles.strokeStyle != 'undefined') ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        ctx.restore();
        return this;
    }

    function setPolyDraw(bool)
    {
        this.polyDraw = bool;
        return this;
    }

    function drawCircle(ctx, pos, r)
    {
        if (typeof ctx == 'undefined') return this;
        ctx = iio.Graphics.prepTransformedContext(ctx, this, pos, r);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        iio.Graphics.drawShadow(ctx, this);
        if (this.polyDraw) var clip = false;
        else var clip = true;
        if (!iio.Graphics.drawImage(ctx, this.img, clip))
        {
            ctx.drawImage(this.img, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.restore();
        }
        if (typeof this.anims != 'undefined' && !iio.Graphics.drawImage(ctx, this.anims[this.animKey].srcs[this.animFrame]))
        {
            ctx.drawImage(this.anims[this.animKey].srcs[this.animFrame], -this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.restore();
        }
        if (typeof this.styles != 'undefined')
        {
            if (typeof this.styles.fillStyle != 'undefined') ctx.fill();
            if (typeof this.styles.strokeStyle != 'undefined') ctx.stroke();
            if (this.styles.refLine) iio.Graphics.drawLine(ctx, 0, 0, this.radius, 0);
        }
        ctx.restore();
        return this;
    }
    iio.Circle.prototype.draw = drawCircle;
    iio.Circle.prototype.setPolyDraw = setPolyDraw;
    iio.Poly.prototype.draw = function (ctx)
    {
        if (typeof ctx == 'undefined') return this;
        ctx = iio.Graphics.prepTransformedContext(ctx, this);
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (var i = 1; i < this.vertices.length; i++)
        ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        ctx.closePath();
        iio.Graphics.finishPathShape(ctx, this, this.originToLeft, this.originToTop, this.width, this.height);
    }
    iio.Rect.prototype.draw = iio.SimpleRect.prototype.draw = drawRect;
    iio.Rect.prototype.clearSelf = iio.SimpleRect.prototype.clearSelf = function (ctx)
    {
        return clearShape(ctx, this, this.width, this.height);
    }
    iio.Line.prototype.clearSelf=function(ctx){
        return clearShape(ctx,this,this.endPos.x,this.endPos.y);
    }
    iio.Circle.prototype.clearSelf = function (ctx)
    {
        return clearShape(ctx, this, this.radius * 2, this.radius * 2);
    }
    iio.Poly.prototype.clearSelf = function (ctx)
    {
        return clearShape(ctx, this, this.width, this.height, this.originToLeft, this.originToTop);
    }

    function clearShape(ctx, obj, w, h, oL, oT)
    {
        ctx.save();
        iio.Graphics.transformContext(ctx, obj.pos, obj.rotation);
        if (typeof obj.rAxis != 'undefined') iio.Graphics.transformContext(ctx, obj.rAxis);
        var dV = new iio.Vec(2, 2);
        if (typeof obj.styles != 'undefined')
        {
            if (typeof obj.styles.lineWidth != 'undefined') dV.add(obj.styles.lineWidth, obj.styles.lineWidth);
            else if (typeof obj.styles.strokeStyle != 'undefined') dV.add(2, 2);
            if (typeof obj.styles.shadow != 'undefined' && typeof obj.styles.shadow.shadowOffset != 'undefined')
            {
                var origin;
                if (typeof oL != 'undefined') origin = new iio.Vec(oL - dV.x, oT - dV.y)
                else origin = new iio.Vec(-w / 2 - dV.x, -h / 2 - dV.y)
                origin.add(-Math.abs(obj.styles.shadow.shadowOffset.x) - 8, -Math.abs(obj.styles.shadow.shadowOffset.y) - 8);
                dV.add(Math.abs(obj.styles.shadow.shadowOffset.x) * 2 + 16, Math.abs(obj.styles.shadow.shadowOffset.y) * 2 + 16);
                ctx.clearRect(origin.x, origin.y, w + dV.x, h + dV.y);
                ctx.restore();
                return obj;
            }
        }
        ctx.clearRect(-w / 2 - dV.x / 2, -h / 2 - dV.y / 2, w + dV.x, h + dV.y);
        ctx.restore();
        return obj;
    }
    if (typeof Box2D != 'undefined')
    {
        var b2Shape = Box2D.Collision.Shapes.b2Shape,
            b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
            b2Joint = Box2D.Dynamics.Joints.b2Joint;

        b2PolygonShape.prototype.prepGraphics = function (scale)
        {
            this.originToLeft = iio.getSpecVertex(this.m_vertices, function (v1, v2)
            {
                if (v1.x > v2.x) return true;
                return false
            }).x * scale;
            this.originToTop = iio.getSpecVertex(this.m_vertices, function (v1, v2)
            {
                if (v1.y > v2.y) return true;
                return false
            }).y * scale;
            this.width = iio.getSpecVertex(this.m_vertices, function (v1, v2)
            {
                if (v1.x < v2.x) return true;
                return false
            }).x * scale - this.originToLeft;
            this.height = iio.getSpecVertex(this.m_vertices, function (v1, v2)
            {
                if (v1.y < v2.y) return true;
                return false
            }).y * scale - this.originToTop;
            this.styles = {};
            return this;
        }
        b2CircleShape.prototype.prepGraphics = function (scale)
        {
            this.radius = this.m_radius * scale;
            this.styles = {};
            return this;
        }

        function prepGraphics()
        {
            this.styles = {};
            return this
        }
        b2Joint.prototype.prepGraphics = prepGraphics;
        b2Shape.prototype.prepGraphics = prepGraphics;
        b2Shape.prototype.setAlpha = setAlpha;
        b2Joint.prototype.setAlpha = setAlpha;
        b2Joint.prototype.setLineWidth = setLineWidth;
        b2Shape.prototype.setLineWidth = setLineWidth;
        b2Joint.prototype.setStrokeStyle = setStrokeStyle;
        b2Shape.prototype.setStrokeStyle = setStrokeStyle;
        b2Joint.prototype.setShadowColor = setShadowColor;
        b2Shape.prototype.setShadowColor = setShadowColor;
        b2Joint.prototype.setShadowBlur = setShadowBlur;
        b2Shape.prototype.setShadowBlur = setShadowBlur;
        b2Joint.prototype.setShadowOffset = setShadowOffset;
        b2Shape.prototype.setShadowOffset = setShadowOffset;
        b2Joint.prototype.setShadow = setShadow;
        b2Shape.prototype.setShadow = setShadow;
        b2Shape.prototype.setFillStyle = setFillStyle;
        b2CircleShape.prototype.drawReferenceLine = drawReferenceLine;
        b2Shape.prototype.fadeIn = fadeIn;
        b2Shape.prototype.fadeOut = fadeOut;
        b2Shape.prototype.fade = fade;
        b2Joint.prototype.fadeIn = fadeIn;
        b2Joint.prototype.fadeOut = fadeOut;
        b2Joint.prototype.fade = fade;
        b2Shape.prototype.setImgOffset = setImgOffset;
        b2Shape.prototype.setImgScale = setImgScale;
        b2Shape.prototype.setImgRotation = setImgRotation;
        b2Shape.prototype.setImgSize = setImgSize;
        b2Shape.prototype.addImage = addImage;
        b2Shape.prototype.flipImage = flipImage;
        b2Shape.prototype.addAnim = addAnim;
        //b2Shape.prototype.createWithImage = createWithImage;
        //b2Shape.prototype.createWithAnim = createWithAnim;
        b2Shape.prototype.nextAnimFrame = nextAnimFrame;
        b2Shape.prototype.setAnimFrame = setAnimFrame;
        b2Shape.prototype.setAnimKey = setAnimKey;
        b2Shape.prototype.playAnim = playAnim;
        b2Shape.prototype.play1Anim = play1Anim;
        b2Shape.prototype.stopAnim = stopAnim;
        b2CircleShape.prototype.draw = drawCircle;
        b2CircleShape.prototype.setPolyDraw = setPolyDraw;
        Box2D.Collision.Shapes.b2PolygonShape.prototype.draw = function (ctx, pos, r, scale)
        {
            ctx = iio.Graphics.prepTransformedContext(ctx, this, pos, r);
            ctx.beginPath();
            ctx.moveTo(this.m_vertices[0].x * scale, this.m_vertices[0].y * scale);
            for (var i = 1; i < this.m_vertices.length; i++)
            ctx.lineTo(this.m_vertices[i].x * scale, this.m_vertices[i].y * scale);
            ctx.closePath();
            iio.Graphics.finishPathShape(ctx, this, this.originToLeft, this.originToTop, this.width, this.height);
        }
        Box2D.Dynamics.b2Body.draw = function (ctx, scale)
        {
            for (f = this.objs[i].GetFixtureList(); f; f = f.m_next)
            {
                s = f.GetShape();
                if (typeof s.draw != 'undefined') s.draw(ctx, new iio.Vec(this.objs[i].m_xf.position.x * scale, this.objs[i].m_xf.position.y * scale), this.objs[i].GetAngle(), scale);
            }
        }

        function drawJoint(ctx, scale)
        {
            var b1 = this.GetBodyA();
            var b2 = this.GetBodyB();
            var xf1 = b1.m_xf;
            var xf2 = b2.m_xf;
            var x1 = xf1.position;
            var x2 = xf2.position;
            var p1 = this.GetAnchorA();
            var p2 = this.GetAnchorB();
            iio.Graphics.prepStyledContext(ctx, this.styles);
            switch (this.m_type)
            {
            case Box2D.Dynamics.Joints.b2Joint.e_distanceJoint:
                iio.Graphics.drawLine(ctx, p1.x * scale, p1.y * scale, p2.x * scale, p2.y * scale);
                break;
            case Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint:
                {
                    var pulley = ((this instanceof b2PulleyJoint ? this : null));
                    var s1 = pulley.GetGroundAnchorA();
                    var s2 = pulley.GetGroundAnchorB();
                    iio.Graphics.drawLine(ctx, s1.x * scale, s1.y * scale, p1.x * scale, p1.y * scale);
                    iio.Graphics.drawLine(ctx, s2.x * scale, s2.y * scale, p2.x * scale, p2.y * scale);
                    iio.Graphics.drawLine(ctx, s1.x * scale, s1.y * scale, s2.x * scale, s2.y * scale);
                }
                break;
            case Box2D.Dynamics.Joints.b2Joint.e_mouseJoint:
                iio.Graphics.drawLine(ctx, p1.x * scale, p1.y * scale, p2.x * scale, p2.y * scale);
                break;
            default:
                if (b1 != this.m_groundBody) iio.Graphics.drawLine(ctx, x1.x * scale, x1.y * scale, p1.x * scale, p1.y * scale);
                iio.Graphics.drawLine(ctx, p1.x * scale, p1.y * scale, p2.x * scale, p2.y * scale);
                if (b2 != this.m_groundBody) iio.Graphics.drawLine(ctx, x2.x * scale, x2.y * scale, p2.x * scale, p2.y * scale);
            }
        }
        Box2D.Dynamics.Joints.b2Joint.prototype.draw = drawJoint;
    }
})();