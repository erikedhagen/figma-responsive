
export const getSiblingVariants = (node: any): any => {
  const master = node.masterComponent

  if (master === undefined || master.parent === null) return
  const variants = master.parent.children

  return variants?.length > 0 ? variants : []
}

export const getCurrentBreakpoint = (node: any): string => {
  const sizes = {
    xs: 0,
    sm: 300,
    lg: 768
  }
  let currentSize = 'xs'
  Object.keys(sizes).forEach((key) => {
    if (node.width >= sizes[key as keyof typeof sizes]) {
      currentSize = key
    }
  })

  return currentSize
}

export const getCurrentVariant = (node: any, variants: any[]): ComponentNode | null => {
  const currentBreakpoint = getCurrentBreakpoint(node)

  console.log('currentBreakpoint', currentBreakpoint)

  if (variants === undefined || variants.length === 0) return null
  if (node?.variantProperties?.screen === currentBreakpoint) return null

  let selectedVariant = null
  variants.forEach((variant: any) => {
    if (variant?.variantProperties?.screen === undefined) return
    const screen = variant.variantProperties.screen
    console.log(screen)
    if (currentBreakpoint === screen) {
      selectedVariant = variant
    }
  })

  return selectedVariant
}
