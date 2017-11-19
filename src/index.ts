// Import types only
import {Static, FactoryComponent, ComponentTypes, Vnode} from 'mithril'
declare function require(moduleName: string): any
// Script or module?
const m: Static = typeof window === 'object' && !!window['m']
	? window['m']
	: require('mithril')

/** Represents a single option in a select */
export interface Option {
	/** Unique value that identifies this option. */
	value: any
	/** Content to display for this option. Can be a string or component.
	    If this property is omitted then the value property will be used for display. */
	content?: string | ComponentTypes<any,any>
	/** If content is a mithril component, this attrs object will be supplied to it. */
	attrs?: any
}

/** Attrs object for MSelect component */
export interface Attrs {
	/** Array of Option objects */
	options: Option[]
	/** Optional prompt content to display until user selects an option.
	    If this is omitted, the first option content will be displayed. */
	promptContent?: string | Vnode<any,any> | Vnode<any,any>[] | ComponentTypes<any,any>
	/** If promptContent is a mithril component, this attrs object will be supplied to it. */
	promptAttrs?: any
	/** Optional value to use for element id attribute. */
	id?: string
	/** Optional name of hidden input for form. If none supplied, no hidden input. */
	name?: string
	/** Optional label id to use for aria-labelledby attribute. */
	labelId?: string
	/** Value of option that will be selected on creation. Otherwise will be 1st option. */
	defaultValue?: any
	/** Additional class string to use on containing element. */
	class?: string
	/** Callback that will be passed the value of the selected option. */
	onchange?(value: any): void
}

/**
 * mithril-select Component
 */
const mithrilSelect: FactoryComponent<Attrs> = function(
	{attrs: {defaultValue, promptContent, options}}
) {
	let curValue: any = undefined
	let isOpen = false
	let isFocused = false
	let rootElement: HTMLElement = undefined as any
	const uid = generateUid()

	if (!promptContent && options && options.length > 0) {
		curValue = options[0].value
	}
	if (defaultValue !== undefined) {
		const o = findOption(options, defaultValue)
		if (o) {
			curValue = defaultValue
		} else {
			console.warn(`defaultValue (${defaultValue}) does not exist in supplied MSelect Options.`)
			defaultValue = undefined
		}
	}

	/** Handle event when child element is focused */
	function onFocus (e: FocusEvent) {
		if (e.target instanceof Node && rootElement.contains(e.target)) {
			isFocused = true
		}
	}

	/** Handle event when child element is blurred */
	function onBlur (e: FocusEvent) {
		if (e.target instanceof Node && rootElement.contains(e.target)) {
			isFocused = false
			// Elements will blur THEN focus, so there is a moment where none of the
			// select's elements will be focused. In order to prevent closing the
			// select in these cases, we delay a frame to be sure no elements
			// are going to be focused and that the select should really close.
			requestAnimationFrame(() => {
				if (isOpen && !isFocused) {
					close()
					m.redraw()
				}
			})
		}
	}

	function toggle (options: Option[]) {
		if (!isOpen) {
			open(options)
		} else {
			close()
		}
	}

	function open (options: Option[]) {
		isOpen = true
		// When the component is opened, the idea is to focus
		// either the currently selected option or the first one
		// (like a native browser select.)
		// Then we want to allow the arrow keys to move up & down.
		if (options && options.length > 0) {
			let i = 0
			if (curValue !== undefined) {
				i = findOptionIndex(options, curValue)
			} else {
				i = 0
			}
			const elOpt = rootElement.childNodes[1].childNodes[0].childNodes[i] as HTMLElement
			// Must delay a frame before focusing
			requestAnimationFrame(() => {
				elOpt.focus()
			})
		}
	}

	function close() {
		isOpen = false
	}

	// Return object with component hooks
	return {
		oncreate ({dom}) {
			window.addEventListener('focus', onFocus, true)
			window.addEventListener('blur', onBlur, true)
			rootElement = dom as HTMLElement
		},

		onremove() {
			window.removeEventListener('focus', onFocus, true)
			window.removeEventListener('blur', onBlur, true)
		},

		view ({attrs: {
			id, name, promptContent, promptAttrs, labelId,
			options, onchange, class: klass
		}}) {
			let curOpt = findOption(options, curValue)
			if (!curOpt) {
				if (options.length > 0 && !promptContent) {
					curOpt = options[0]
				}
			}

			return m('.mithril-select', {class: klass},
				m('.mithril-select-head',
					{
						role: 'combobox',
						'aria-expanded': isOpen ? 'true' : 'false',
						'aria-haspopup': 'true',
						'aria-owns': uid,
						'aria-labelledby': labelId,
						id: id,
						tabIndex: '0',
						onclick: (e: MouseEvent) => {
							e.stopPropagation()
							if (!isOpen) e.preventDefault()
							toggle(options)
						},
						onkeydown: (e: KeyboardEvent) => {
							if (e.keyCode === 32) {
								e.preventDefault()
								toggle(options)
							} else if (e.keyCode === 27) {
								if (isOpen) {
									close()
									// Re-focus head on close
									requestAnimationFrame(() => {
										(rootElement.childNodes[0] as HTMLElement).focus()
									})
								}
							} else if (e.keyCode === 37 || e.keyCode === 38) {
								// When select head is focused, arrow keys cycle through options.
								// Change to previous selection
								if (!options || options.length < 1) return
								let index = 0
								if (curValue !== undefined) {
									index = findOptionIndex(options, curValue)
									index = pmod(index - 1, options.length)
								}
								curValue = options[index].value
								onchange && onchange(curValue)
							} else if (e.keyCode === 39 || e.keyCode === 40) {
								// Change to next selection
								if (!options || options.length < 1) return
								let index = 0
								if (curValue !== undefined) {
									index = findOptionIndex(options, curValue)
									index = pmod(index + 1, options.length)
								}
								curValue = options[index].value
								onchange && onchange(curValue)
							}
						}
					},
					!!curOpt
						? renderContent(curOpt.content != null ? curOpt.content : curOpt.value, curOpt.attrs)
						: renderContent(promptContent, promptAttrs)
				),
				m('.mithril-select-body',
					{class: isOpen ? 'mithril-select-body-open' : undefined},
					m('ul.mithril-select-options',
						{
							role: 'listbox',
							'aria-hidden': isOpen ? 'true' : 'false',
							id: uid
						},
						options.map((o, index) =>
							m('li.mithril-select-option',
								{
									'aria-role': 'option',
									tabIndex: '-1',
									onclick: (e: Event) => {
										e.stopPropagation()
										curValue = o.value
										isFocused = false
										close()
										// Re-focus head on close
										requestAnimationFrame(() => {
											(rootElement.childNodes[0] as HTMLElement).focus()
										})
										onchange && onchange(o.value)
									},
									onkeydown: (e: KeyboardEvent) => {
										if (e.keyCode === 13) {
											// Enter selects
											curValue = o.value
											isFocused = false
											close()
											// Re-focus head on close
											requestAnimationFrame(() => {
												(rootElement.childNodes[0] as HTMLElement).focus()
											})
											onchange && onchange(o.value)
										} else if (e.keyCode === 27) {
											// Escape closes
											close()
											// Re-focus head on close
											requestAnimationFrame(() => {
												(rootElement.childNodes[0] as HTMLElement).focus()
											})
										} else if (e.keyCode === 37 || e.keyCode === 38) {
											// Left or up keys - focus previous
											const i = pmod(index - 1, options.length)
											const elOpt = rootElement.childNodes[1].childNodes[0].childNodes[i] as HTMLElement
											// Must delay a frame before focusing
											requestAnimationFrame(() => {
												elOpt.focus()
											})
										} else if (e.keyCode === 39 || e.keyCode === 40) {
											// Right or down keys - focus next
											const i = pmod(index + 1, options.length)
											const elOpt = rootElement.childNodes[1].childNodes[0].childNodes[i] as HTMLElement
											requestAnimationFrame(() => {
												elOpt.focus()
											})
										}
									}
								},
								renderContent(o.content, o.attrs)
							)
						)
					)
				),
				!!name && m('input', {name, type: 'hidden', value: curValue})
			)
		}
	}
}

/** Render content of the head or an option */
function renderContent (
	content?: null | undefined | string | Vnode<any,any> | Vnode<any,any>[] | ComponentTypes<any,any>,
	attrs?: any
): any {
	// What type is content...
	if (content && (typeof content === 'function' || typeof (content as any)['view'] === 'function')) {
		// Assume component - turn into vnode
		return m(content as ComponentTypes<any,any>, attrs)
	}
	return content
}

/** Always positive modulus */
function pmod (n: number, m: number) {
	return ((n % m + m) % m)
}

/** Generate an ID for aria */
function generateUid() {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
	let id = ''
	for (let i = 0; i < 16; ++i) {
		id += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return id
}

/** Find an option by value. Returns undefined if not found. */
function findOption (options: Option[], value: any) {
	if (!options) return undefined
	for (let i = 0, n = options.length; i < n; ++i) {
		if (options[i].value === value) return options[i]
	}
	return undefined
}

/** Find an option index by value. Returns -1 if not found. */
function findOptionIndex (options: Option[], value: any) {
	if (!options) return -1
	for (let i = 0, n = options.length; i < n; ++i) {
		if (options[i].value === value) return i
	}
	return -1
}

export default mithrilSelect

if (typeof window === 'object' && window['m'] === m) {
	// Add global to window if used as a script
	window['mithrilSelect'] = mithrilSelect
}
