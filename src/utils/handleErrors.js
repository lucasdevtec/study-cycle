export default function HandleError(err, fallbackMessage, notFoundMessage) {
	if (err?.name === "ZodError") {
		return NextResponse.json(
			{
				type: "validation",
				errors: formatZodError(err),
			},
			{ status: 400 },
		);
	}

	if (notFoundMessage && err?.message === notFoundMessage) {
		return NextResponse.json({ message: err.message }, { status: 404 });
	}

	return NextResponse.json({ message: err?.message || fallbackMessage }, { status: 500 });
}
