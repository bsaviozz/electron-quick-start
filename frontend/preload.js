const { contextBridge, ipcRenderer } = require("electron");
console.log("Preload script loaded!");  

contextBridge.exposeInMainWorld("electronAPI", {
    registerUser: (userData) => ipcRenderer.invoke("registerUser", userData),
    loginUser: (userId) => ipcRenderer.invoke("loginUser", userId)
});
