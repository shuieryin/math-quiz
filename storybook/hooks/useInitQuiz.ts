import { useEffect } from "react";
import { initDb } from "../lib/DbHelper";

export default () => {
	useEffect(() => {
		(async () => {
			await initDb();
		})();
	}, []);
};
