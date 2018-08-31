export default class {
  constructor (ctx, multiple, panel, rPos) {
    this.ctx = ctx
    this.multiple = multiple
    this.panel = panel
    this.rPos = rPos
  }

  drawText (item) {
    let {source, top, left, width, height, color, fontSize = 12, align = 'left', textBaseline = 'top', centerType = 'all', xAdjust = 0, yAdjust = 0} = item
    if (!source) return
    fontSize = this.multiple * fontSize
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setTextBaseline(textBaseline)
    this.ctx.setFillStyle(color)
    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign(align)
    let x = this._textAlignX(align, centerType, xAdjust, left, top, width, height)
    let y = (top + this.rPos.top + yAdjust) * this.multiple
    this.ctx.fillText(source, x, y)
    this.ctx.restore()
  }

  /**
   * 绘制多行文本
   * @param text  文本内容
   * @param color 颜色
   * @param fontSize  字体大小
   * @param align 排列方式
   * @param res 盒子信息
   * @param textMargin  换行间距调整比例
   * @param textBaseline  文本基线
   * @param xAdjust 可调整的偏移量x轴
   * @param yAdjust 可调整的偏移量y轴
   * @private
   */
  drawTextArea (item) {
    let {source, top, left, width, height, color, fontSize = 12, align = 'left', textBaseline = 'top', centerType = 'all', textMargin, xAdjust = 0, yAdjust = 0} = item
    if (!source) return
    fontSize = this.multiple * fontSize
    if (!textMargin) {
      switch (this.multiple) {
        case 1 :
          textMargin = 1.6
          break
        case 2 :
          textMargin = 0.8
          break
        case 3 :
          textMargin = 0.5
          break
        default :
          break
      }
    }
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setTextBaseline(textBaseline)
    this.ctx.setFillStyle(color)
    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign(align)
    // 匹配换行符
    let newArr = source.split(/\n|\r/g)
    // 分割数组中所有的文字
    let newTextArr = []
    newArr.forEach(item => {
      let newText = item
      let len = this.ctx.measureText(newText).width
      newText = this._spliceTextLine(newText, len, width * this.multiple)
      newTextArr.push(...newText)
    })
    // 开始绘制文字
    let baseY = top + this.rPos.top + yAdjust // 基础y轴位置
    newTextArr.forEach((item, index) => {
      this.ctx.setFontSize(fontSize)
      let y = (baseY + (index * fontSize * textMargin)) * this.multiple
      let x = this._textAlignX(align, centerType, xAdjust, left, top, width, height)
      this.ctx.fillText(item, x, y)
    })
    this.ctx.restore()
  }

  /**
   * 文本对齐方式
   * @param align 排列方式
   * @param centerType 居中形式（相对画板居中，相对盒子居中）
   * @param xAdjust 可调整的偏移量x轴
   * @param res 盒子信息
   * @returns {number}
   * @private
   */
  _textAlignX (align, centerType, xAdjust, left, top, width, height) {
    let x = 0
    switch (align) {
      case 'center': {
        x = (this.panel.width + xAdjust) / 2 * this.multiple
        if (centerType !== 'all') {
          x = ((left + this.rPos.left) + width / 2 + xAdjust) * this.multiple
        }
        break
      }
      case 'left': {
        x = (left + this.rPos.left + xAdjust) * this.multiple
        break
      }
      default: {
        break
      }
    }
    return x
  }

  /**
   * canvas 每行的字
   * @param text 文本文件
   * @param sumLen 文字的总长度
   * @param lineLen 每行文字的长度
   * @returns {Array} return每行文字的数组
   * @private
   */
  _spliceTextLine (text, sumLen, lineLen) {
    let arr = []
    let line = sumLen / lineLen
    let textLen = text.length
    let everyLineNumber = Math.floor(textLen / line)
    for (let i = 0; i < line; i++) {
      arr.push(text.substring(i * everyLineNumber, everyLineNumber * (i + 1)))
    }
    return arr
  }
}
