import { getCurrentVariant, getSiblingVariants } from './helpers/document'

class Engine {
  constructor () {
    console.log('Engine created')
  }

  public start (): void {
    console.log('Start')

    this.bindEvents()
    this.update()
  }

  private bindEvents (): void {
    figma.on('selectionchange', () => {
      if (figma.currentPage.selection.length > 0) {
        console.log(figma.currentPage.selection[0])

        // const component = figma.currentPage.selection[0]

        // this.handleResponsive(component)
      }
    })
  }

  private update (): void {
    const selection = figma.currentPage.selection

    selection.forEach((node: any) => {
      this.handleSelectedNode(node)
    })

    setTimeout(() => {
      this.update()
    }, 500)
  }

  private handleSelectedNode (node: any): void {
    if (node.type === 'FRAME') {
      this.handleSelectedFrame(node)
    } else {
      this.handleResponsiveComponent(node)
    }
  }

  private handleSelectedFrame (frame: any): void {
    const children = frame.children
    children.forEach((child: any) => {
      this.handleResponsiveComponent(child)
    })
  }

  handleResponsiveComponent (node: any): void {
    const variants = getSiblingVariants(node)
    if (variants?.length === 0) return

    const selectedVariant = getCurrentVariant(node, variants)
    console.log('handleResponsiveComponent', node)

    if (selectedVariant == null) return

    const parent = node.parent
    const { width, x, y } = node
    node.remove()
    const instance = selectedVariant.createInstance()
    instance.x = x
    instance.y = y
    instance.resize(width, instance.height)
    console.log('place instance at', x, y)
    if (parent !== null) {
      parent.appendChild(instance)
    } else {
      figma.currentPage.appendChild(instance)
    }

    console.log('responsive variant', selectedVariant)
  }
}

export default Engine
