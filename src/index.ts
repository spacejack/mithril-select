import * as m from 'mithril'

/** Represents a single option in a mithril-select */
export interface Option {
	/** Unique value that identifies this option. Can be any type except `undefined`. */
	value: any
	/**
	 * @deprecated Use `view` instead.
	 * Content to display for this option. Can be a string or component.
	 * If neither content or view are provided then the value property will be used for display.
	 */
	content?: string | m.ComponentTypes<any, any>
	/**
	 * @deprecated Use `view` instead.
	 * If content is a mithril component, this attrs object will be supplied to it.
	 */
	attrs?: any
	/** Either a string to display for the option or a callback that renders vnodes. */
	view?: string | (() => m.Children)
}

/** Attrs object for mithril-select component */
export interface Attrs {
	/** Array of `Option` objects */
	options: Option[]
	/**
	 * @deprecated Use `view` instead.
	 * Optional prompt content to display until user selects an option.
	 */
	promptContent?: string | m.Vnode<any,any> | m.Vnode<any, any>[] | m.ComponentTypes<any, any>
	/**
	 * @deprecated Use promptView instead.
	 * If promptContent is a mithril component, this attrs object will be supplied to it.
	 */
	promptAttrs?: any
	/**
	 * Optional prompt to display until the user selects an option.
	 * Supply either a string to display or a callback that renders vnodes.
	 */
	promptView?: string | (() => m.Children)
	/** Optional value to use for element id attribute. */
	id?: string
	/**
	 * Optional name of hidden input for form. If none supplied, no hidden input will be rendered.
	 * Hidden input value will be coerced to string.
	 */
	name?: string
	/** Current selected option value. Omitting or setting to `undefined` is the same as supplying no value. (`null` can be a value.) */
	value?: any
	/** Optional label id to use for aria-labelledby attribute. */
	labelId?: string
	/** Value of option that will be selected on creation. Overridden by `value` if supplied, otherwise will be first option. */
	initialValue?: any
	/** @deprecated Use `initialValue` instead. */
	defaultValue?: any
	/** Additional class string to use on containing element. */
	class?: string
	/** Callback that will be passed the value of the selected option when selection changes. */
	onchange?(value: any): void
}

/**
 * mithril-select Component
 */
const mithrilSelect: m.FactoryComponent<Attrs> = function mithrilSelect (vnode) { // tslint:disable-line no-shadowed-variable
	let curValue: any
	let isOpen = false
	let isFocused = false
	let rootElement: HTMLElement
	let options = vnode.attrs.options
	let onchange = vnode.attrs.onchange
	const uid = generateUid()

	// Create a scope for some initialization so these temp vars don't hang around.
	;(function init() {
		const {defaultValue, value, promptView, promptContent} = vnode.attrs
		let initialValue = vnode.attrs.initialValue
		if (!promptView && !promptContent && options && options.length > 0) {
			curValue = options[0].value
		}
		if (defaultValue !== undefined && initialValue === undefined) {
			console.warn('mithril-select: defaultValue is deprecated. Use initialValue instead.')
			initialValue = defaultValue
		}
		if (value !== undefined) {
			// If a `value` attr was supplied it overrides/is used as initialValue
			if (findOption(options, value)) {
				initialValue = value
			} else {
				console.warn(`mithril-select: value (${value}) does not exist in supplied options.`)
			}
		}
		if (initialValue !== undefined) {
			if (findOption(options, initialValue)) {
				curValue = initialValue
			} else {
				console.warn(`mithril-select: initialValue (${initialValue}) does not exist in supplied options.`)
			}
		}
		// Destroy reference to our initial vnode
		vnode = undefined as any
	}())

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

	function toggle () {
		if (!isOpen) {
			open()
		} else {
			close()
		}
	}

	function open () {
		isOpen = true
		// When the component is opened, the idea is to focus
		// either the currently selected option or the first one
		// (like a native browser select.)
		// Then we want to allow the arrow keys to move up & down.
		if (options && options.length > 0) {
			const i = curValue !== undefined ? Math.max(0, findOptionIndex(options, curValue)) : 0
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

	/** Select next option in closed select with keyboard */
	function selectNextOption (dir: 1 | -1) {
		if (!options || options.length < 1) return
		let index = 0
		if (curValue !== undefined) {
			index = findOptionIndex(options, curValue)
			index = (index >= 0) ? pmod(index + dir, options.length) : 0
		}
		curValue = options[index].value
		onchange && onchange(curValue)
	}

	/** Focus next option when navigating open select with keyboard */
	function focusNextOption (index: number, dir: 1 | -1) {
		const i = pmod(index + dir, options.length)
		const elOpt = rootElement.childNodes[1].childNodes[0].childNodes[i] as HTMLElement
		// Must delay a frame before focusing
		requestAnimationFrame(() => {
			elOpt.focus()
		})
	}

	/** Handle click events on select head */
	function onClickHead (e: MouseEvent) {
		e.stopPropagation()
		if (!isOpen) e.preventDefault()
		toggle()
	}

	/** Handle keydown events on select head */
	function onKeydownHead (e: KeyboardEvent) {
		if (e.keyCode === 32) {
			e.preventDefault()
			toggle()
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
			selectNextOption(-1)
		} else if (e.keyCode === 39 || e.keyCode === 40) {
			// Change to next selection
			selectNextOption(1)
		}
	}

	/** Handle click events on select options */
	function onClickOption (e: Event) {
		e.stopPropagation()
		const opt = options[Number((e.currentTarget as HTMLElement).getAttribute('data-index'))]
		curValue = opt.value
		isFocused = false
		close()
		// Re-focus head on close
		requestAnimationFrame(() => {
			(rootElement.childNodes[0] as HTMLElement).focus()
		})
		onchange && onchange(opt.value)
	}

	/** Handle keydown events on select options */
	function onKeydownOption (e: KeyboardEvent) {
		const index = Number((e.currentTarget as HTMLElement).getAttribute('data-index'))
		const opt = options[index]
		if (e.keyCode === 13) {
			// Enter selects
			curValue = opt.value
			isFocused = false
			close()
			// Re-focus head on close
			requestAnimationFrame(() => {
				(rootElement.childNodes[0] as HTMLElement).focus()
			})
			onchange && onchange(opt.value)
		} else if (e.keyCode === 27) {
			// Escape closes
			close()
			// Re-focus head on close
			requestAnimationFrame(() => {
				(rootElement.childNodes[0] as HTMLElement).focus()
			})
		} else if (e.keyCode === 37 || e.keyCode === 38) {
			// Left or up keys - focus previous
			focusNextOption(index, -1)
		} else if (e.keyCode === 39 || e.keyCode === 40) {
			// Right or down keys - focus next
			focusNextOption(index, 1)
		}
	}

	// Return object with component hooks
	return {
		oncreate ({dom}) {
			window.addEventListener('focus', onFocus, true)
			window.addEventListener('blur', onBlur, true)
			rootElement = dom as HTMLElement
		},

		onupdate ({dom}) {
			rootElement = dom as HTMLElement
		},

		onremove() {
			window.removeEventListener('focus', onFocus, true)
			window.removeEventListener('blur', onBlur, true)
		},

		view ({attrs}) {
			options = attrs.options
			onchange = attrs.onchange
			if (attrs.value !== undefined) {
				curValue = attrs.value
			}
			let curOpt = findOption(options, curValue)
			if (!curOpt) {
				curValue = undefined
				if (options.length > 0 && !attrs.promptView && !attrs.promptContent) {
					curOpt = options[0]
					curValue = options[0].value
				}
			}

			return m('.mithril-select', {class: attrs.class},
				m('.mithril-select-head',
					{
						role: 'combobox',
						'aria-expanded': isOpen ? 'true' : 'false',
						'aria-haspopup': 'true',
						'aria-owns': uid,
						'aria-labelledby': attrs.labelId,
						id: attrs.id,
						tabIndex: '0',
						onclick: onClickHead,
						onkeydown: onKeydownHead
					},
					!!curOpt
						? curOpt.view != null
							? typeof curOpt.view === 'string' ? curOpt.view : curOpt.view()
							: renderContent(curOpt.content != null ? curOpt.content : curOpt.value, curOpt.attrs)
						: attrs.promptView != null
							? typeof attrs.promptView === 'string' ? attrs.promptView : attrs.promptView()
							: renderContent(attrs.promptContent, attrs.promptAttrs)
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
									key: index,
									tabIndex: '-1',
									'aria-role': 'option',
									'data-index': String(index),
									onclick: onClickOption,
									onkeydown: onKeydownOption
								},
								o.view != null
									? typeof o.view === 'string' ? o.view : o.view()
									: renderContent(o.content, o.attrs)
							)
						)
					)
				),
				!!name && m('input', {name, type: 'hidden', value: curValue})
			)
		}
	}
}

export default mithrilSelect

/** Render content of the head or an option */
function renderContent (
	content?: null | undefined | string | m.Vnode<any, any> | m.Vnode<any, any>[] | m.ComponentTypes<any, any>,
	attrs?: any
): any {
	// What type is content...
	if (content && (typeof content === 'function' || typeof (content as any).view === 'function')) {
		// Assume component - render vnode
		return m(content as m.ComponentTypes<any, any>, attrs)
	}
	return content
}

/** Always positive modulus */
function pmod (n: number, d: number) {
	return ((n % d + d) % d)
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
