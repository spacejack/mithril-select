import m from 'mithril'

export interface ListItem {
	id: string
	text: string
}

export interface Attrs {
	items: ListItem[]
}

const item = {id: '', text: ''}

export default {
	view ({attrs: {items}}) {
		return m('.editable-list',
			items.map((it, i) => m('.item',
				m('button',
					{
						type: 'button',
						onclick() {
							items.splice(i, 1)
						}
					},
					m.trust('&times;')
				),
				` id: ${it.id} text: ${it.text}`
			)),
			m('.add-item',
				'id: ',
				m('input', {
					type: 'text',
					value: item.id,
					style: 'width: 4em',
					oninput: m.withAttr('value', id => {
						item.id = id
					})
				}),
				' text: ',
				m('input', {
					type: 'text',
					value: item.text,
					style: 'width: 5em',
					oninput: m.withAttr('value', text => {
						item.text = text
					})
				}),
				' ',
				m('button',
					{
						type: 'button',
						onclick() {
							if (item.id && item.text && !items.some(i => i.id === item.id)) {
								items.push({...item})
								item.id = ''
								item.text = ''
							}
						}
					},
					'Add'
				)
			)
		)
	}
} as m.Component<Attrs>
