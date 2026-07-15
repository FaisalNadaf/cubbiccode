/**
 * Emits a schema.org JSON-LD block.
 *
 * The payload is our own data, never user input, so serialising it into the
 * script tag is safe; `<` is still escaped because a literal `</script>` inside
 * a JSON string would close the tag early and break the page.
 *
 * @format
 */

export function JsonLd({ data }: { data: object | object[] }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
		/>
	);
}
