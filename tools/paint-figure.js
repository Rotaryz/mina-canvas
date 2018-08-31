export default class {
  constructor (ctx, multiple, panel, rPos) {
    this.ctx = ctx
    this.multiple = multiple
    this.panel = panel
    this.rPos = rPos
  }

  /**
   * 绘制图片
   * @param imgUrl  图片路径
   * @param res 盒子信息
   * @param xAdjust 可调整的偏移量x轴
   * @param yAdjust 可调整的偏移量y轴
   * @private
   */
  drawImg (item) {
    let {source, top, left, width, height, xAdjust = 0, yAdjust = 0, mode, imgInfo, color = '#fff'} = item
    if (!source) return
    let x = (left + this.rPos.left + xAdjust) * this.multiple
    let y = (top + this.rPos.top + yAdjust) * this.multiple
    let w = width * this.multiple
    let h = height * this.multiple
    if (!mode) {
      this.ctx.drawImage(source, x, y, w, h)
      return
    }
    let sW = imgInfo.width
    let sH = imgInfo.height
    let sWH = sW / sH
    let nx, ny, nw, nh
    switch (mode) {
      case 'aspectFill': {
        if ((w <= h && sW <= sH) || (w > h && sW <= sH)) {
          nw = w
          nh = nw / sWH
          ny = y - (nh - h) / 2
          nx = x
        } else {
          nh = h
          nw = nh * sWH
          nx = x - (nw - w) / 2
          ny = y
        }
        break
      }
      case 'widthFix': {
        nw = w
        nh = nw / sWH
        ny = y
        nx = x
        break
      }
      default:
        break
    }
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setStrokeStyle(color)
    this.ctx.setFillStyle(color)
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x, y)
    this.ctx.lineTo(x + w, y)
    this.ctx.lineTo(x + w, y + h)
    this.ctx.lineTo(x, y + h)
    this.ctx.closePath()
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.drawImage(source, nx, ny, nw, nh)
    this.ctx.restore()
  }

  drawImgShadow (item) {
    let offsetX = item.shadow[0] * this.multiple
    let offsetY = item.shadow[1] * this.multiple
    let blur = item.shadow[2] * this.multiple
    let color = item.shadow[3]
    let shadowBackground = item.shadow[4] || '#fff'
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setFillStyle(shadowBackground)
    if (item.shape === 'circle') {
      this.drawCircle(item)
    } else {
      this.drawRect(item)
    }
    this.ctx.setShadow(offsetX, offsetY, blur, color)
    // 0 8px 16px 0 rgba(74, 144, 226, 0.15)
    this.ctx.fill()
    this.ctx.restore()
  }

  drawImgClip (item) {
    let { shapeBg = '#fff' } = item
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setFillStyle(shapeBg)
    if (item.shape === 'circle') {
      this.drawCircle(item)
    } else {
      this.drawRect(item)
    }
    // this..setShadow(0, 0.5 * vw, 10, 'rgba(55,75,99,0.15)')
    this.ctx.clip()
    this.drawImg(item)
    this.ctx.restore()
  }

  /**
   * 绘制圆形
   * @param r 半径
   * @param res 盒子的信息
   * @param xAdjust 可调整的偏移量x轴
   * @param yAdjust 可调整的偏移量y轴
   * @private
   */
  drawCircle (item) {
    let {r, top, left, width, height, xAdjust = 0, padding = 0} = item
    if (item.shadow) {
      padding = item.shadow[item.shadow.length - 1]
    }
    // r = (width / 2 + padding) * this.multiple
    r = (width / 2 + padding) * this.multiple
    let x = (left + this.rPos.left + width / 2 + xAdjust) * this.multiple
    let y = (top + this.rPos.top + height / 2 + xAdjust) * this.multiple
    this.ctx.arc(x, y, r, 0, 2 * Math.PI)
    this.ctx.fill()
  }

  /**
   * 填充矩形
   * @param color
   * @param res
   * @param xAdjust
   * @param yAdjust
   */
  drawRect (item) {
    let {color = '#fff', top, left, width, height, xAdjust = 0, yAdjust = 0} = item
    let x = (left + this.rPos.left + xAdjust) * this.multiple
    let y = (top + this.rPos.top + yAdjust) * this.multiple
    let w = width * this.multiple
    let h = height * this.multiple
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setFillStyle(color)
    this.ctx.fillRect(x, y, w, h)
    this.ctx.restore()
  }
}
