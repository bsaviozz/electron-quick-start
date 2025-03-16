const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    registerUser: (userData) => ipcRenderer.invoke("registerUser", userData),
    loginUser: (userId) => ipcRenderer.invoke("loginUser", userId)
});
