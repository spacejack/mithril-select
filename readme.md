# Mithril Custom Select Component

A custom select widget component for [Mithril.js](https://mithril.js.org/). Built to mimic native browser select behaviour (if not looks) as closely as possible, including acessibility and keyboard features. The minimal CSS included can be easily overridden and customized by your own styles.

Try a [live demo here](https://spacejack.github.io/mithril-select/).

## Install:

    npm install mithril-select

You will need to include the css file for some basic working styles.

Using PostCSS with [postcss-import](https://github.com/postcss/postcss-import) allows you to import the stylesheet from `node_modules`:

```css
@import "mithril-select";
```

If you're using a sass compiler, you can add:

```scss
@import "node_modules/mithril-select/index";
```

to one of your sass files.

Otherwise you can copy the `node_modules/mithril-select/index.css` file to your project and add it to your html page.

See the `example` in the git repository for examples of style customization.

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
  /** Unique value that identifies this option. Can be any type except `undefined`. */
  value: any
  /**
   * String content to display for this option.
   * If neither content or view are provided then the value property will be used for display.
   */
  content?: string
  /** Instead of `content` a `view` callback can be supplied to render vnode(s). */
  view?(): m.Children
}

/** Attrs object for Select component */
interface Attrs {
  /** Array of `Option` objects */
  options: Option[]
  /**
   * Optional prompt content string to display until user selects an option.
   * If this is omitted, the first option content will be displayed.
   */
  promptContent?: string
  /** Instead of `promptContent` a `promptView` callback can be supplied to render vnode(s). */
  promptView?(): m.Children
  /** Optional value to use for element id attribute. */
  id?: string
  /** Optional name of hidden input for form. If none supplied, no hidden input will be rendered. Hidden input value will be coerced to string. */
  name?: string
  /** Current selected option value. Omitting or setting to `undefined` is the same as supplying no value. (`null` can be a value.) */
  value?: any
  /** Optional label id to use for aria-labelledby attribute. */
  labelId?: string
  /** Value of option that will be selected on creation. Overridden by `value` if supplied, otherwise will be first option. */
  initialValue?: any
  /** Additional class string to use on containing element. */
  class?: string
  /** Callback that will be passed the value of the selected option when selection changes. */
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
