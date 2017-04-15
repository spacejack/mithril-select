/// <reference types="mithril" />
import * as m from 'mithril';
/** Represents a single option in a select */
export interface Option {
    /** Unique value that identifies this option. */
    value: any;
    /** Content to display for this option. Can be a string or component.
        If this property is omitted then the value property will be used for display. */
    content?: string | m.ComponentTypes<any, any>;
    /** If content is a mithril component, this attrs object will be supplied to it. */
    attrs?: any;
}
/** Attrs object for MSelect component */
export interface Attrs {
    /** Array of Option objects */
    options: Option[];
    /** Optional prompt content to display until user selects an option.
        If this is omitted, the first option content will be displayed. */
    promptContent?: string | m.Vnode<any, any> | m.Vnode<any, any>[] | m.ComponentTypes<any, any>;
    /** If promptContent is a mithril component, this attrs object will be supplied to it. */
    promptAttrs?: any;
    /** Optional value to use for element id attribute. */
    id?: string;
    /** Optional label id to use for aria-labelledby attribute. */
    labelId?: string;
    /** Value of option that will be selected on creation. Otherwise will be 1st option. */
    defaultValue?: any;
    /** Additional class string to use on containing element. */
    class?: string;
    /** Callback that will be passed the value of the selected option. */
    onchange?(value: any): void;
}
declare var _default: m.FactoryComponent<Attrs>;
export default _default;
