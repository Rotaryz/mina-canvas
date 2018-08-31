import wx from '../utils/wx'
import PaintText from './paint-text'
import PaintFigure from './paint-figure'

export default class {
  constructor (props) {
    if (!props.canvasId) {
      throw new Error(`canvasId is null`)
    }
    this.ctx = wx.createCanvasContext(props.canvasId)
    this.multiple = props.multiple
    this.panel = props.panel
    this.rPos = {left: 0 - this.panel.left, top: 0 - this.panel.top}
    this._initText()
    this._initFigure()
  }

  _initText () {
    this.PaintText = new PaintText(this.ctx, this.multiple, this.panel, this.rPos)
  }

  _initFigure () {
    this.PaintFigure = new PaintFigure(this.ctx, this.multiple, this.panel, this.rPos)
  }

  drawElements (els) {
    els.map((item) => {
      this._drawItem(item)
    })
  }

  _drawItem (item) {
    switch (item.drawType) {
      case 'img': {
        this._drawItemImg(item)
        break
      }
      case 'text': {
        this.PaintText.drawText(item)
        break
      }
      case 'text-area': {
        this.PaintText.drawTextArea(item)
        break
      }
      case 'rect': {
        this.PaintFigure.drawRect(item)
        break
      }
      default:
        break
    }
  }

  _drawItemImg (item) {
    if (item.shadow && item.shape) {
      this.PaintFigure.drawImgShadow(item)
      this.PaintFigure.drawImgClip(item)
    } else if (item.shadow && !item.shape) {
      this.PaintFigure.drawImgShadow(item)
      this.PaintFigure.drawImg(item)
    } else if (!item.shadow && item.shape) {
      this.PaintFigure.drawImgClip(item)
    } else {
      this.PaintFigure.drawImg(item)
    }
  }
}
