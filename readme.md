# Mithril Custom Select Component

A custom select widget component for [Mithril](https://mithril.js.org/) 1.1. Built to mimick native browser select behaviour (if not looks) as closely as possible, including acessibility and keyboard features.

Try a [live demo here](https://spacejack.github.io/mithril-select/).

## Install:

    npm install mithril-select

If you're using a sass compiler, you can add:

    @import 'node_modules/mithril-select/index';

Otherwise you can copy that `index.css` file to your project and add it to your html page.

Note that currently this component does not support changing options between redraws.

## Example use:

```typescript
import mithrilSelect from "mithril-select"
// var mithrilSelect = require("mithril-select").default

// Options for the select
const colourOptions = [
  {value: null, content: "Select a colour..."},
  {value: "red", content: "Red"},
  {value: "blue", content: "Blue"},
  {value: "green", content: "Green"},
  {value: "yellow", content: "Yellow"},
  {value: "orange", content: "Orange"},
  {value: "pink", content: "Pink"}
]

let colour = ""

const component = {
  view() {
    return m(mithrilSelect, {
      options: colourOptions,
      // A CSS class to add to the root element of the select
      class: 'my-select',
      // Respond to selection changes
      onchange: (val) => {
        colour = val != null
          ? colourOptions.find(c => c.value === val)!.content
          : ""
      }
    })
  }
}

```

### All options and component Attrs:

(See `src/index.ts`)

```typescript
/** Represents a single option in a select */
interface Option {
  /** Unique value that identifies this option. */
  value: any
  /** Content to display for this option. Can be a string or component.
      If this property is omitted then the value property will be used for display. */
  content?: string | m.ComponentTypes<any,any>
  /** If content is a mithril component, this attrs object will be supplied to it. */
  attrs?: any
}

/** Attrs object for Select component */
interface Attrs {
  /** Array of Option objects */
  options: Option[]
  /** Optional prompt content to display until user selects an option.
      If this is omitted, the first option content will be displayed. */
  promptContent?: string | m.Vnode<any,any> | m.Vnode<any,any>[] | m.ComponentTypes<any,any>
  /** If promptContent is a mithril component, this attrs object will be supplied to it. */
  promptAttrs?: any
  /** Optional value to use for element id attribute. */
  id?: string
  /** Optional label id to use for aria-labelledby attribute. */
  labelId?: string
  /** Value of option that will be selected on creation. Otherwise will be 1st option. */
  defaultValue?: any
  /** Additional class string to use on containing element. */
  class?: string
  /** Callback that will be passed the value of the selected option. */
  onchange?(value: any): void
}
```

## Development Install:

First git clone this repo. Then:

    npm install

## Build module

    npm run build

## Serve, compile & watch example app:

    npm start

Then go to http://localhost:3000/ in your browser.

### Build a plain ES2015 version of the library:

    npm run build-es2015

Will output `src/index.js`

---

Thanks to [barneycarroll](https://github.com/barneycarroll) for providing an initial POC demo using global focus/blur listeners.
