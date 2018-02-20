/// <reference types="mithril" />
import * as m from 'mithril';
/** Represents a single option in a mithril-select */
export interface Option {
    /** Unique value that identifies this option. Can be any type except `undefined`. */
    value: any;
    /**
     * Content to display for this option. Can be a string or component.
     * If neither content or view are provided then the value property will be used for display.
     * Types other than string are deprecated. Use view instead of vnodes or components here.
     */
    content?: string | m.ComponentTypes<any, any>;
    /**
     * @deprecated Use `view` instead.
     * If content is a mithril component, this attrs object will be supplied to it.
     */
    attrs?: any;
    /** Instead of `content` a `view` callback can be supplied to render vnode(s). */
    view?(): m.Children;
}
/** Attrs object for mithril-select component */
export interface Attrs {
    /** Array of `Option` objects */
    options: Option[];
    /**
     * Optional prompt content to display until user selects an option.
     * If this is omitted, the first option content will be displayed.
     * Types other than string are deprecated. Use promptView instead of vnodes or components here.
     */
    promptContent?: string | m.Vnode<any, any> | m.Vnode<any, any>[] | m.ComponentTypes<any, any>;
    /**
     * @deprecated Use promptView instead.
     * If promptContent is a mithril component, this attrs object will be supplied to it.
     */
    promptAttrs?: any;
    /** Instead of `promptContent` a `promptView` callback can be supplied to render vnode(s). */
    promptView?(): m.Children;
    /** Optional value to use for element id attribute. */
    id?: string;
    /**
     * Optional name of hidden input for form. If none supplied, no hidden input will be rendered.
     * Hidden input value will be coerced to string.
     */
    name?: string;
    /** Current selected option value. Omitting or setting to `undefined` is the same as supplying no value. (`null` can be a value.) */
    value?: any;
    /** Optional label id to use for aria-labelledby attribute. */
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
declare const mithrilSelect: m.FactoryComponent<Attrs>;
export default mithrilSelect;
