import { useEffect, useState } from "react";

// noinspection JSUnusedGlobalSymbols
export default () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	return isMounted;
};
