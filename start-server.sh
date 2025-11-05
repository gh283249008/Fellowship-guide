#!/bin/bash
# 启动本地服务器并自动打开浏览器

echo "正在启动本地服务器..."
echo "服务器地址: http://localhost:8000/index.html"
echo "按 Ctrl+C 停止服务器"
echo ""

# 延迟1秒后自动打开浏览器
(sleep 1 && open http://localhost:8000/Documents/%E7%A7%98%E5%A2%83%E6%88%98%E7%9B%9F%E9%85%8D%E8%A3%85%E5%99%A8/index.html) &

# 使用 Python 3 启动 HTTP 服务器
python3 -m http.server 8000
