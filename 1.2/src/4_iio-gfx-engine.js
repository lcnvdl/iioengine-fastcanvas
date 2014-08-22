// ============================
//  iio Graphics Engine
// ============================
(function ()
{
    iio.Graphics = {};
    iio.Graphics.transformContext = function (ctx, pos, r)
    {
        //if (this.partialPixels) 
        ctx.translate(pos.x, pos.y);
        //else ctx.translate(Math.round(pos.x), Math.round(pos.y));
        if (typeof (r) != 'undefined') ctx.rotate(r);
    }
    iio.Graphics.applyContextStyles = function (ctx, styles)
    {
        if (typeof styles == 'undefined') return;
        if (typeof styles.lineWidth != 'undefined') ctx.lineWidth = styles.lineWidth;
        if (typeof styles.shadowColor != 'undefined') ctx.shadowColor = styles.shadowColor;
        if (typeof styles.shadowBlur != 'undefined') ctx.shadowBlur = styles.shadowBlur;
        ctx.globalAlpha = (styles.alpha === 0) ? 0 : (styles.alpha || 1);
        if (typeof styles.lineCap != 'undefined') ctx.lineCap = styles.lineCap;
        if (typeof styles.shadowOffset != 'undefined')
        {
            ctx.shadowOffsetX = styles.shadowOffset.x;
            ctx.shadowOffsetY = styles.shadowOffset.y;
        }
        if (typeof styles.fillStyle != 'undefined') ctx.fillStyle = styles.fillStyle;
        if (typeof styles.strokeStyle != 'undefined') ctx.strokeStyle = styles.strokeStyle;
    }
    iio.Graphics.prepStyledContext = function (ctx, styles)
    {
        ctx.save();
        if (typeof styles != 'undefined') iio.Graphics.applyContextStyles(ctx, styles);
        if (typeof styles != 'undefined' && typeof styles.shadow != 'undefined') iio.Graphics.applyContextStyles(ctx, styles.shadow);
        return ctx;
    }
    iio.Graphics.prepTransformedContext = function (ctx, obj, pos, r)
    {
        ctx = ctx || obj.ctx;
        pos = pos || obj.pos;
        r = r || obj.rotation;
        ctx.save();
        if (typeof obj.styles != 'undefined') iio.Graphics.applyContextStyles(ctx, obj.styles);
        iio.Graphics.transformContext(ctx, pos, r);
        if (typeof obj.rAxis != 'undefined') iio.Graphics.transformContext(ctx, obj.rAxis);
        if (obj.flipImg) ctx.scale(-1, 1);
        return ctx;
    }
    iio.Graphics.finishPathShape = function (ctx, obj, left, top, width, height)
    {
        iio.Graphics.drawShadow(ctx, obj);
        if (!iio.Graphics.drawImage(ctx, obj.img, true))
        {
            ctx.drawImage(obj.img, left, top, width, height);
            ctx.restore();
        }
        if (typeof obj.anims != 'undefined' && !iio.Graphics.drawImage(ctx, obj.anims[obj.animKey].srcs[obj.animFrame]))
        {
            ctx.drawImage(obj.anims[obj.animKey].srcs[obj.animFrame], left, top, width, height);
            ctx.restore();
        }
        if (typeof obj.styles != 'undefined')
        {
            if (typeof obj.styles.fillStyle != 'undefined') ctx.fill();
            if (typeof obj.styles.strokeStyle != 'undefined') ctx.stroke();
        }
        ctx.restore();
    }
    iio.Graphics.drawLine = function (ctx, v1, v2, x2, y2)
    {
        if (typeof v2.x != 'undefined')
        {
            x2 = v2.x;
            y2 = v2.y;
        }
        v2 = v1.y || v2;
        v1 = v1.x || v1;
        ctx.beginPath();
        ctx.moveTo(v1, v2);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    iio.Graphics.drawLine = function (ctx, v1, v2, x2, y2)
    {
        if (typeof v2.x != 'undefined')
        {
            x2 = v2.x;
            y2 = v2.y;
        }
        v2 = v1.y || v2;
        v1 = v1.x || v1;
        ctx.beginPath();
        ctx.moveTo(v1, v2);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    iio.Graphics.drawDottedLine = function (ctx, da, v1, v2, x2, y2)
    {
        if (typeof v2.x != 'undefined')
        {
            x2 = v2.x;
            y2 = v2.y;
        }
        v2 = v1.y || v2;
        v1 = v1.x || v1;
        ctx.beginPath();
        ctx.dashedLine(v1, v2, x2, y2, da);
        ctx.stroke();
    }
    iio.Graphics.drawShadow = function (ctx, obj)
    {
        if (typeof obj.styles == 'undefined' || typeof obj.styles.shadow == 'undefined') return;
        ctx.save();
        iio.Graphics.applyContextStyles(ctx, obj.styles.shadow);
        if (typeof obj.styles.fillStyle != 'undefined' || typeof obj.img != 'undefined' || typeof obj.anims != 'undefined') ctx.fill();
        else if (typeof obj.styles.strokeStyle != 'undefined') ctx.stroke();
        ctx.restore();
    }
    iio.Graphics.drawRectShadow = function (ctx, obj)
    {
        if (typeof obj.styles == 'undefined' || typeof obj.styles.shadow == 'undefined') return;
        ctx.save();
        iio.Graphics.applyContextStyles(ctx, obj.styles.shadow);
        if (typeof obj.styles.rounding != 'undefined' && typeof obj.styles.rounding != 0) iio.Graphics.drawRoundedRectPath(ctx, obj);
        else
        {
            if (typeof obj.styles.fillStyle != 'undefined' || typeof obj.img != 'undefined' || typeof obj.anims != 'undefined') ctx.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
            else if (typeof obj.styles.strokeStyle != 'undefined') ctx.strokeRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        }
        ctx.restore();
    }
    iio.Graphics.drawRoundedRectPath = function (ctx, obj)
    {
        ctx.beginPath();
        ctx.moveTo(-obj.width / 2 + obj.styles.rounding, -obj.height / 2);
        ctx.lineTo(-obj.width / 2 + obj.width - obj.styles.rounding, -obj.height / 2);
        ctx.quadraticCurveTo(-obj.width / 2 + obj.width, -obj.height / 2, -obj.width / 2 + obj.width, -obj.height / 2 + obj.styles.rounding);
        ctx.lineTo(-obj.width / 2 + obj.width, -obj.height / 2 + obj.height - obj.styles.rounding);
        ctx.quadraticCurveTo(-obj.width / 2 + obj.width, -obj.height / 2 + obj.height, -obj.width / 2 + obj.width - obj.styles.rounding, -obj.height / 2 + obj.height);
        ctx.lineTo(-obj.width / 2 + obj.styles.rounding, -obj.height / 2 + obj.height);
        ctx.quadraticCurveTo(-obj.width / 2, -obj.height / 2 + obj.height, -obj.width / 2, -obj.height / 2 + obj.height - obj.styles.rounding);
        ctx.lineTo(-obj.width / 2, -obj.height / 2 + obj.styles.rounding);
        ctx.quadraticCurveTo(-obj.width / 2, -obj.height / 2, -obj.width / 2 + obj.styles.rounding, -obj.height / 2);
        ctx.closePath();
        ctx.strokeStyle = obj.styles.strokeStyle;
        ctx.stroke();
        ctx.fillStyle = obj.styles.fillStyle;
        ctx.fill();
        ctx.clip();
    }
    iio.Graphics.drawImage = function (ctx, img, clip)
    {
        if (typeof img != 'undefined')
        {
            ctx.save();
            if (typeof img.pos != 'undefined' || typeof img.rotation != 'undefined')
            {
                var p = img.pos || new iio.Vec();
                var r = img.rotation || 0;
                iio.Graphics.transformContext(ctx, p, r);
            }
            if (clip) ctx.clip();
            if (typeof img.size != 'undefined') ctx.drawImage(img, -img.size.x / 2, -img.size.y / 2, img.size.x, img.size.y);
            else if (img.nativeSize) ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
            else if (typeof img.scale != 'undefined') ctx.drawImage(img, -img.width * img.scale / 2, -img.height * img.scale / 2, img.width * img.scale, img.height * img.scale);
            else return false;
            ctx.restore();
            return true;
        }
        return true;
    }
    iio.Graphics.drawSprite = function (ctx, w, h, s, i, flip, clip)
    {
        if (typeof s != 'undefined')
        {
            ctx.save();
            if (clip) ctx.clip();
            if (flip) ctx.scale(-1, 1);
            ctx.drawImage(s.src, s.frames[i].x, s.frames[i].y, s.frames[i].w, s.frames[i].h, -w / 2, -h / 2, w, h);
            ctx.restore();
            return true;
        }
        return true;
    }
})();