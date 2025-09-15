import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 780,
		minWidth: 1280,
		minHeight: 780,
		center: true,
	});

	mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
	mainWindow.setMenu(null);

	if (isDev()) {
		mainWindow.loadURL("http://localhost:12000");
	} else {
		mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
	}
});
