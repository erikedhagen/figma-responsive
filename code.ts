// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

const getSiblingVariants = (node: any) => {
  const master = node.masterComponent

  if(!master || !master.parent) return;
  const variants = master.parent.children;

  return variants || [];
}

const update = () => {
  if(!figma.currentPage.selection.length) return;

  handleResponsive(figma.currentPage.selection[0])
}


const getCurrentBreakpoint = (node: any) => {
  const sizes = {
    'xs': 0,
    'sm': 300
  }
  let currentSize = 'xs';
  if(node.width >= sizes.sm) {
    currentSize = 'sm'
  }

  return currentSize;
}

const getCurrentVariant = (node: any, variants: any[]) : ComponentNode | null => {
  const currentBreakpoint = getCurrentBreakpoint(node)

  if(node.variantProperties.screen == currentBreakpoint) return null;

  let selectedVariant = null;
  variants.forEach((variant: any) => {
    const screen = variant.variantProperties.screen;
    console.log(screen)
    if(currentBreakpoint == screen) {
      selectedVariant = variant;
    }
  });

  return selectedVariant;
}

const handleResponsive = (node: any) => {
  const variants = getSiblingVariants(node)
  if(!variants?.length) return;

  const selectedVariant = getCurrentVariant(node, variants)

  if(selectedVariant == null) return;

  const {width, height, x, y} = node;
  node.remove();
  const instance = selectedVariant.createInstance();
  instance.x = x;
  instance.y = y;
  instance.resize(width, instance.height)
  console.log('place instance at', x, y)
  figma.currentPage.appendChild(instance);

  console.log('responsive variant', selectedVariant)
}

setInterval(update, 100)

figma.on('selectionchange', () => {
  if(figma.currentPage.selection.length) {
    console.log(figma.currentPage.selection[0])
    
    const component = figma.currentPage.selection[0]

    handleResponsive(component)
  }

  // figma.ui.postMessage({
  //   type: 'selection-change',
  //   nodes: figma.currentPage.selection
  // });
})