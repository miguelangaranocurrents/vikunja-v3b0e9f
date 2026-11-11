import type {Fragment, Slice} from '@tiptap/pm/model'

// Plain-text copy of an editor selection. ProseMirror's default puts bullet lists
// on the clipboard without their markers, so the list structure is lost on paste elsewhere.
export function serializeSliceAsText(slice: Slice): string {
	return serializeBlocks(slice.content, '').join('\n\n')
}

function serializeBlocks(fragment: Fragment, indent: string): string[] {
	const blocks: string[] = []

	fragment.forEach(node => {
		if (node.type.name === 'bulletList') {
			const items: string[] = []
			node.forEach(item => {
				const [first = '', ...rest] = serializeBlocks(item.content, indent + '  ')
				const itemLines = [`${indent}- ${first.trimStart()}`, ...rest]
				items.push(itemLines.join('\n'))
			})
			blocks.push(items.join('\n'))
			return
		}

		blocks.push(indent + node.textContent)
	})

	return blocks
}
