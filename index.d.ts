/// <reference types="mithril" />
import * as m from 'mithril';
/** Represents a single option in a mithril-select */
export interface Option {
    /** Unique value that identifies this option. Can be any type except `undefined`. */
    value: any;
    /**
     * @deprecated Use `view` instead.
     * Content to display for this option. Can be a string or component.
     * If neither content or view are provided then the value property will be used for display.
     */
    content?: string | m.ComponentTypes<any, any>;
    /**
     * @deprecated Use `view` instead.
     * If content is a mithril component, this attrs object will be supplied to it.
     */
    attrs?: any;
    /** Either a string to display for the option or a callback that renders vnodes. */
    view?: string | (() => m.Children);
}
/** Attrs object for mithril-select component */
export interface Attrs {
    /** Array of `Option` objects */
    options: Option[];
    /**
     * @deprecated Use `view` instead.
     * Optional prompt content to display until user selects an option.
     */
    promptContent?: string | m.Vnode<any, any> | m.Vnode<any, any>[] | m.ComponentTypes<any, any>;
    /**
     * @deprecated Use promptView instead.
     * If promptContent is a mithril component, this attrs object will be supplied to it.
     */
    promptAttrs?: any;
    /**
     * Optional prompt to display until the user selects an option.
     * Supply either a string to display or a callback that renders vnodes.
     */
    promptView?: string | (() => m.Children);
    /** Optional value to use for element id attribute. */
    id?: string;
    /**
     * Optional name of hidden input for form. If none supplied, no hidden input will be rendered.
     * Hidden input value will be coerced to string.
     */
    name?: string;
    /** Current selected option value. Omitting or setting to `undefined` is the same as supplying no value. (`null` can be a value.) */
    value?: any;
    /** Optional aria-labelledby attribute */
    ariaLabelledby?: string;
    /** @deprecated Use ariaLabelledBy instead. Optional label id to use for aria-labelledby attribute. */
    labelId?: string;
    /** Value of option that will be selected on creation. Overridden by `value` if supplied, otherwise will be first option. */
    initialValue?: any;
    /** @deprecated Use `initialValue` instead. */
    defaultValue?: any;
    /** Additional class string to use on containing element. */
    class?: string;
    /** Callback that will be passed the value of the selected option when selection changes. */
    onchange?(value: any): void;
}
/**
 * mithril-select Component
 */
export default function MithrilSelect(): m.Component<Attrs>;
