# 本地服务器运行指南

由于浏览器安全限制，使用 `file://` 协议无法加载 JSON 文件，需要使用本地 HTTP 服务器运行。

## 方法一：使用 Python（推荐）

### macOS/Linux:
```bash
# 在项目目录下运行
python3 -m http.server 8000
```

### Windows:
```bash
# 在项目目录下运行
python -m http.server 8000
```

然后在浏览器中访问：**http://localhost:8000/index.html**

**注意：** 如果看到目录列表页面，请点击 `index.html` 文件，或直接在地址栏输入 `http://localhost:8000/index.html`

---

## 方法二：使用 Node.js（如果已安装）

```bash
# 全局安装 http-server（只需一次）
npm install -g http-server

# 在项目目录下运行
http-server -p 8000
```

然后在浏览器中访问：**http://localhost:8000/index.html**

---

## 方法三：使用 VS Code 的 Live Server 扩展（推荐，支持自动刷新）

1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键点击 `index.html` 文件
3. 选择 "Open with Live Server"

**优势：** 修改文件后，浏览器会自动刷新，无需手动刷新页面

---

## 方法四：使用便捷脚本（macOS/Linux）

直接运行项目目录下的 `start-server.sh`：

```bash
./start-server.sh
```

---

## 注意事项

- 服务器启动后，保持终端窗口打开
- 停止服务器：按 `Ctrl + C`
- 默认端口是 8000，如果被占用可以改为其他端口（如 8001, 8080 等）
- **文件实时更新：** 修改JSON文件后，只需刷新浏览器（F5或Cmd+R）即可看到更新，无需重启服务器
- 如果想自动刷新，推荐使用 VS Code 的 Live Server 扩展

---

## 快速启动（推荐）

在项目目录下运行：

```bash
python3 -m http.server 8000
```

然后打开浏览器访问：**http://localhost:8000/index.html**

或者使用便捷脚本（会自动打开浏览器）：

```bash
./start-server.sh
```

